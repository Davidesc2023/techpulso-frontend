/*
  TechPulso - descargar-imagenes.mjs
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Qué hace
  --------
  Las imágenes del diseño (Inicio, noticias, Detalle, mapa de Contacto)
  vienen de enlaces externos de Google. Si Google cambia o bloquea un
  enlace, la imagen deja de verse en la página publicada. Este script:

    1. Busca en el código todos los enlaces de imágenes externas.
    2. Descarga cada imagen a la carpeta public/img/.
    3. Cambia en el código cada enlace externo por la ruta local (img/...).

  Si una imagen no se puede descargar, deja su enlace original sin tocar y
  la muestra en el resumen final, para poder resolverla a mano.

  Cómo se usa (desde la carpeta techpulso-angular)
  ------------------------------------------------
    node scripts/descargar-imagenes.mjs --listar    solo muestra qué encontró
    node scripts/descargar-imagenes.mjs             descarga y cambia los enlaces

  Opciones
  --------
    --listar            no descarga ni cambia nada, solo lista los enlaces
    --hosts=a.com,b.com además de googleusercontent.com, también descarga
                        imágenes de esos dominios
    --tiempo=30         segundos máximos de espera por imagen (por defecto 30)
    --paralelo=4        descargas al mismo tiempo (por defecto 4)

  Notas
  -----
  - No necesita instalar nada: usa solo lo que trae Node.
  - Se puede ejecutar más de una vez: lo que ya se descargó no se vuelve a
    buscar, y solo se reintenta lo que había fallado.
  - Los archivos del código solo se modifican si TODAS las descargas
    terminaron de procesarse, así que un corte a la mitad no deja nada
    a medias. Si algo no sale como se esperaba, "git checkout ." deshace
    los cambios.
*/
import { promises as fs } from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------

// Carpeta del proyecto: la que contiene a "scripts", sin importar desde
// dónde se ejecute el comando.
const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Dónde se busca código con enlaces, y dónde se guardan las imágenes.
const CARPETAS_A_REVISAR = ['src', 'public'];
const CARPETA_IMAGENES = path.join('public', 'img');
// Los enlaces nuevos son relativos (img/...), igual que los demás archivos
// de public/, para que funcionen también cuando la página se publique
// dentro de una carpeta (por ejemplo en GitHub Pages).
const PREFIJO_PUBLICO = 'img/';

// Tipos de archivo del código donde puede haber enlaces.
const EXTENSIONES_DE_CODIGO = new Set(['.html', '.ts', '.css', '.scss', '.json']);
// Carpetas que nunca se revisan.
const CARPETAS_IGNORADAS = new Set(['node_modules', 'dist', '.angular', '.git']);

// Dominios que se consideran de imágenes aunque el enlace no termine en
// ".jpg" o similar (los de Google no llevan extensión).
const HOSTS_DE_IMAGENES = ['googleusercontent.com'];
// Dominios que se ignoran siempre: son fuentes, estilos o definiciones.
const HOSTS_IGNORADOS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'www.w3.org', 'cdn.tailwindcss.com'];
const EXTENSIONES_DE_IMAGEN = /\.(png|jpe?g|webp|gif|avif|svg)$/i;

// Algunos servidores rechazan las peticiones que no parecen venir de un
// navegador, por eso se envían estas cabeceras.
const CABECERAS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
};

// ---------------------------------------------------------------------------
// Opciones de la línea de comandos
// ---------------------------------------------------------------------------

function leerOpciones(argumentos) {
  const opciones = { listar: false, hosts: [], tiempoSegundos: 30, paralelo: 4 };
  for (const argumento of argumentos) {
    if (argumento === '--listar') {
      opciones.listar = true;
    } else if (argumento.startsWith('--hosts=')) {
      opciones.hosts = argumento
        .slice('--hosts='.length)
        .split(',')
        .map((h) => h.trim())
        .filter(Boolean);
    } else if (argumento.startsWith('--tiempo=')) {
      opciones.tiempoSegundos = Number(argumento.slice('--tiempo='.length)) || 30;
    } else if (argumento.startsWith('--paralelo=')) {
      opciones.paralelo = Math.max(1, Number(argumento.slice('--paralelo='.length)) || 4);
    } else {
      console.error(`Opción desconocida: ${argumento}\nMira las opciones en la cabecera de este archivo.`);
      process.exit(2);
    }
  }
  return opciones;
}

// ---------------------------------------------------------------------------
// Paso 1: buscar los enlaces en el código
// ---------------------------------------------------------------------------

// Recorre una carpeta y devuelve la ruta de cada archivo de código.
async function listarArchivos(carpeta) {
  const resultado = [];
  let entradas;
  try {
    entradas = await fs.readdir(carpeta, { withFileTypes: true });
  } catch {
    return resultado; // la carpeta no existe: no pasa nada
  }
  for (const entrada of entradas) {
    const ruta = path.join(carpeta, entrada.name);
    if (entrada.isDirectory()) {
      if (CARPETAS_IGNORADAS.has(entrada.name)) continue;
      // Las imágenes ya descargadas no se vuelven a revisar.
      if (path.relative(RAIZ, ruta) === CARPETA_IMAGENES) continue;
      resultado.push(...(await listarArchivos(ruta)));
    } else if (EXTENSIONES_DE_CODIGO.has(path.extname(entrada.name).toLowerCase())) {
      resultado.push(ruta);
    }
  }
  return resultado;
}

// Dice si un enlace corresponde a una imagen externa que hay que descargar.
function esImagenExterna(url, hostsExtra) {
  let direccion;
  try {
    direccion = new URL(url);
  } catch {
    return false;
  }
  const host = direccion.hostname.toLowerCase();
  if (HOSTS_IGNORADOS.includes(host)) return false;
  const hostsDeImagenes = [...HOSTS_DE_IMAGENES, ...hostsExtra];
  const esHostDeImagenes = hostsDeImagenes.some((h) => host === h || host.endsWith('.' + h));
  return esHostDeImagenes || EXTENSIONES_DE_IMAGEN.test(direccion.pathname);
}

// Busca en todos los archivos los enlaces de imágenes externas. Devuelve un
// mapa: enlace -> { archivos: textos tal como están escritos, por archivo }.
async function buscarEnlaces(hostsExtra) {
  const enlaces = new Map();
  for (const carpeta of CARPETAS_A_REVISAR) {
    for (const archivo of await listarArchivos(path.join(RAIZ, carpeta))) {
      const texto = await fs.readFile(archivo, 'utf8');
      // Un enlace termina en un espacio, una comilla o un paréntesis.
      for (const coincidencia of texto.matchAll(/https?:\/\/[^\s"'<>)\\`]+/g)) {
        const escrito = coincidencia[0];
        // En HTML una "&" puede estar escrita como "&amp;"; para pedir la
        // imagen se usa la forma normal.
        const url = escrito.replaceAll('&amp;', '&');
        if (!esImagenExterna(url, hostsExtra)) continue;
        if (!enlaces.has(url)) enlaces.set(url, { archivos: new Map() });
        const donde = enlaces.get(url).archivos;
        if (!donde.has(archivo)) donde.set(archivo, new Set());
        donde.get(archivo).add(escrito);
      }
    }
  }
  return enlaces;
}

// ---------------------------------------------------------------------------
// Paso 2: descargar
// ---------------------------------------------------------------------------

// Reconoce el tipo de imagen mirando los primeros bytes del archivo, que es
// más fiable que lo que diga el servidor. Devuelve la extensión o null.
function tipoPorContenido(datos) {
  const empieza = (...bytes) => bytes.every((byte, i) => datos[i] === byte);
  if (empieza(0xff, 0xd8, 0xff)) return 'jpg';
  if (empieza(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return 'png';
  if (empieza(0x47, 0x49, 0x46, 0x38)) return 'gif';
  const texto = datos.subarray(0, 16).toString('latin1');
  if (texto.startsWith('RIFF') && texto.slice(8, 12) === 'WEBP') return 'webp';
  if (texto.slice(4, 8) === 'ftyp' && /avif|avis/.test(texto.slice(8, 12))) return 'avif';
  const inicio = datos.subarray(0, 600).toString('utf8').trimStart().toLowerCase();
  if (inicio.includes('<svg') && !inicio.startsWith('<!doctype html') && !inicio.startsWith('<html')) return 'svg';
  return null;
}

// Una página de error suele llegar como HTML con estado 200: se detecta
// para no guardarla como si fuera una imagen.
function pareceHtml(datos) {
  const inicio = datos.subarray(0, 300).toString('utf8').trimStart().toLowerCase();
  return inicio.startsWith('<!doctype html') || inicio.startsWith('<html');
}

class ErrorDeDescarga extends Error {
  constructor(mensaje, reintentable) {
    super(mensaje);
    this.reintentable = reintentable;
  }
}

// Una sola petición. Devuelve { datos, extension } o lanza ErrorDeDescarga.
async function pedirImagen(url, tiempoMs) {
  const control = new AbortController();
  const temporizador = setTimeout(() => control.abort(), tiempoMs);
  try {
    const respuesta = await fetch(url, { signal: control.signal, redirect: 'follow', headers: CABECERAS });
    if (!respuesta.ok) {
      // 5xx son fallos del servidor y pueden pasar; 4xx (403, 404...) no
      // mejoran por reintentar.
      throw new ErrorDeDescarga(`el servidor respondió ${respuesta.status}`, respuesta.status >= 500);
    }
    const datos = Buffer.from(await respuesta.arrayBuffer());
    if (datos.length === 0) throw new ErrorDeDescarga('la respuesta llegó vacía', true);
    if (pareceHtml(datos)) {
      throw new ErrorDeDescarga('llegó una página web en vez de una imagen (el enlace puede estar bloqueado o vencido)', false);
    }
    const extension = tipoPorContenido(datos);
    if (!extension) {
      const tipo = respuesta.headers.get('content-type') ?? 'desconocido';
      throw new ErrorDeDescarga(`lo que llegó no es una imagen reconocida (tipo: ${tipo})`, false);
    }
    return { datos, extension };
  } catch (error) {
    if (error instanceof ErrorDeDescarga) throw error;
    if (error?.name === 'AbortError') {
      throw new ErrorDeDescarga(`tardó más de ${tiempoMs / 1000} segundos`, true);
    }
    throw new ErrorDeDescarga(`no se pudo conectar (${error?.cause?.code ?? error?.message ?? 'error de red'})`, true);
  } finally {
    clearTimeout(temporizador);
  }
}

// Pide la imagen y reintenta hasta 2 veces más si el fallo puede ser pasajero.
async function descargarConReintentos(url, tiempoMs) {
  let ultimoError;
  for (let intento = 1; intento <= 3; intento++) {
    try {
      return await pedirImagen(url, tiempoMs);
    } catch (error) {
      ultimoError = error;
      if (!error.reintentable || intento === 3) break;
      await new Promise((r) => setTimeout(r, 800 * intento));
    }
  }
  throw ultimoError;
}

// Nombre del archivo local: <de dónde viene>-<código del enlace>.<tipo>.
// El código sale del propio enlace, así el mismo enlace siempre da el mismo
// nombre y una imagen repetida en varios lugares se guarda una sola vez.
function codigoDe(url) {
  return crypto.createHash('sha1').update(url).digest('hex').slice(0, 8);
}

function origenDe(archivos) {
  const primero = [...archivos.keys()][0];
  return path.basename(primero, path.extname(primero)).replace(/[^a-z0-9]+/gi, '-').toLowerCase();
}

// Si una ejecución anterior ya descargó esta imagen, devuelve su nombre.
async function yaDescargada(codigo, carpeta) {
  try {
    const existente = (await fs.readdir(carpeta)).find((nombre) => nombre.includes(`-${codigo}.`));
    return existente ?? null;
  } catch {
    return null;
  }
}

// Procesa todos los enlaces con un máximo de descargas simultáneas.
async function procesarTodos(enlaces, opciones, carpetaDestino) {
  const lista = [...enlaces.entries()];
  const resultados = new Map();
  let siguiente = 0;
  let terminados = 0;

  async function trabajador() {
    while (siguiente < lista.length) {
      const [url, info] = lista[siguiente++];
      const codigo = codigoDe(url);
      let resultado;
      try {
        const previa = await yaDescargada(codigo, carpetaDestino);
        if (previa) {
          resultado = { ok: true, nombre: previa, reutilizada: true };
        } else {
          const { datos, extension } = await descargarConReintentos(url, opciones.tiempoSegundos * 1000);
          const nombre = `${origenDe(info.archivos)}-${codigo}.${extension}`;
          await fs.mkdir(carpetaDestino, { recursive: true });
          await fs.writeFile(path.join(carpetaDestino, nombre), datos);
          resultado = { ok: true, nombre, kilobytes: Math.round(datos.length / 1024) };
        }
      } catch (error) {
        resultado = { ok: false, motivo: error.message };
      }
      resultados.set(url, resultado);
      terminados++;
      const estado = resultado.ok
        ? `OK     ${resultado.nombre}${resultado.reutilizada ? ' (ya estaba)' : ` (${resultado.kilobytes} KB)`}`
        : `FALLÓ  ${resumir(url)}  -> ${resultado.motivo}`;
      console.log(`[${terminados}/${lista.length}] ${estado}`);
    }
  }

  await Promise.all(Array.from({ length: Math.min(opciones.paralelo, lista.length) }, trabajador));
  return resultados;
}

// ---------------------------------------------------------------------------
// Paso 3: cambiar los enlaces en el código
// ---------------------------------------------------------------------------

// Reemplaza, en cada archivo, los enlaces descargados por su ruta local.
// Devuelve cuántos archivos cambió y cuántos reemplazos hizo.
async function cambiarEnlaces(enlaces, resultados) {
  // Se agrupan los cambios por archivo para leer y escribir cada uno una vez.
  const cambiosPorArchivo = new Map();
  for (const [url, info] of enlaces) {
    const resultado = resultados.get(url);
    if (!resultado?.ok) continue;
    for (const [archivo, textos] of info.archivos) {
      if (!cambiosPorArchivo.has(archivo)) cambiosPorArchivo.set(archivo, []);
      for (const escrito of textos) {
        cambiosPorArchivo.get(archivo).push([escrito, PREFIJO_PUBLICO + resultado.nombre]);
      }
    }
  }
  let reemplazos = 0;
  for (const [archivo, cambios] of cambiosPorArchivo) {
    let texto = await fs.readFile(archivo, 'utf8');
    for (const [escrito, nuevo] of cambios) {
      const partes = texto.split(escrito);
      reemplazos += partes.length - 1;
      texto = partes.join(nuevo);
    }
    await fs.writeFile(archivo, texto, 'utf8');
  }
  return { archivos: cambiosPorArchivo.size, reemplazos };
}

// ---------------------------------------------------------------------------
// Presentación
// ---------------------------------------------------------------------------

// Acorta un enlace largo para mostrarlo en pantalla.
function resumir(url) {
  return url.length > 70 ? `${url.slice(0, 42)}...${url.slice(-18)}` : url;
}

function nombreCorto(archivo) {
  return path.relative(RAIZ, archivo).replaceAll('\\', '/');
}

// ---------------------------------------------------------------------------
// Programa principal
// ---------------------------------------------------------------------------

async function principal() {
  if (typeof fetch !== 'function') {
    console.error('Esta versión de Node es muy antigua (no trae fetch). Actualiza Node a la versión 18 o superior.');
    process.exit(2);
  }
  const opciones = leerOpciones(process.argv.slice(2));
  console.log(`Proyecto: ${RAIZ}`);
  console.log('Buscando enlaces de imágenes externas en src/ y public/ ...');

  const enlaces = await buscarEnlaces(opciones.hosts);
  if (enlaces.size === 0) {
    console.log('\nNo hay imágenes externas: todo ya está en el proyecto. No hay nada que hacer.');
    return;
  }

  const ocurrencias = [...enlaces.values()].reduce(
    (suma, info) => suma + [...info.archivos.values()].reduce((s, textos) => s + textos.size, 0),
    0,
  );
  console.log(`\nSe encontraron ${enlaces.size} imágenes distintas (en ${ocurrencias} lugares del código):\n`);
  for (const [url, info] of enlaces) {
    const donde = [...info.archivos.keys()].map(nombreCorto).join(', ');
    console.log(`  ${resumir(url)}\n      usada en: ${donde}`);
  }

  if (opciones.listar) {
    console.log('\nSolo se listó (opción --listar). No se descargó ni se cambió nada.');
    return;
  }

  console.log('\nDescargando a public/img/ ...\n');
  const carpetaDestino = path.join(RAIZ, CARPETA_IMAGENES);
  const resultados = await procesarTodos(enlaces, opciones, carpetaDestino);

  const cambio = await cambiarEnlaces(enlaces, resultados);
  const fallidas = [...resultados.entries()].filter(([, r]) => !r.ok);
  const buenas = resultados.size - fallidas.length;

  console.log('\n================ RESUMEN ================');
  console.log(`Descargadas: ${buenas} de ${resultados.size}`);
  console.log(`Código actualizado: ${cambio.reemplazos} enlaces cambiados en ${cambio.archivos} archivos.`);

  if (fallidas.length > 0) {
    console.log(`\nNo se pudieron descargar ${fallidas.length}. Sus enlaces originales NO se tocaron:\n`);
    for (const [url, resultado] of fallidas) {
      const donde = [...enlaces.get(url).archivos.keys()].map(nombreCorto).join(', ');
      console.log(`  - ${resumir(url)}\n      motivo: ${resultado.motivo}\n      usada en: ${donde}`);
    }
    console.log('\nVuelve a ejecutar el script más tarde (solo reintenta lo que falló), o guarda esas imágenes a mano en public/img/.');
    process.exitCode = 1;
  } else {
    console.log('\nListo: todas las imágenes quedaron dentro del proyecto.');
    console.log('Siguiente paso: abre la página (ng serve) y revisa que todas las imágenes se vean.');
  }
}

principal().catch((error) => {
  console.error('\nEl script se detuvo por un error inesperado:', error);
  process.exit(2);
});
