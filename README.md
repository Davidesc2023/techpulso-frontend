# TechPulso

Plataforma web de noticias de tecnología. Es el proyecto del módulo de **Front-End** del Politécnico Gran Colombiano (Grupo B02, Subgrupo 26), y lo fuimos construyendo en tres entregas: primero la maquetación, después un prototipo en HTML, CSS y JavaScript, y al final la aplicación en Angular.

- **Sitio publicado:** https://techpulso-frontend.vercel.app/
- **Repositorio:** https://github.com/Davidesc2023/techpulso-frontend

## Qué se puede hacer en la página

TechPulso funciona como un periódico digital: se pueden leer noticias de tecnología, educación, turismo y comercio, guardar las favoritas, publicar noticias nuevas y escribirle al medio. Tiene cinco vistas:

| Vista | Dirección | Qué hace |
|---|---|---|
| Inicio | `/` | Portada con la noticia principal, noticias destacadas, el bloque "Por qué TechPulso" y la suscripción al boletín. |
| Noticias | `/noticias` | Catálogo con filtros por categoría, buscador, paginación, favoritos y el mini CRUD (crear y eliminar noticias). |
| Detalle | `/detalle` | Un artículo completo con barra de progreso de lectura, botón de favoritos, contacto con el autor y botones para compartir. |
| Favoritos | `/favoritos` | Las noticias que el usuario guardó, con el tiempo total de lectura. |
| Contacto | `/contacto` | Formulario con validaciones, datos de la sede y mapa. |

El enlace **Categorías** del menú lleva al catálogo y baja directo a los filtros (`/noticias#categorias`). Cualquier dirección que no exista vuelve a Inicio.

## Las tres entregas

Todo está en este mismo repositorio, cada entrega en su lugar:

| Entrega | Qué es | Dónde está |
|---|---|---|
| 1. Maquetación | Mockups de las cinco vistas, paleta de colores y tipografía. | `docs/mockups/` |
| 2. Prototipo | Las cinco páginas en HTML, CSS y JavaScript, con las noticias leídas desde un JSON. | Archivos `.html`, `css/`, `js/` y `data/` de la raíz |
| 3. Aplicación final | La misma página hecha en Angular, publicada en internet. | `techpulso-angular/` |

La Entrega 3 es la que está publicada y la que se debe revisar. Las otras dos las dejamos porque hacen parte del proceso.

## Tecnologías

- **Angular 22**: componentes, servicios, router, formularios reactivos y `HttpClient`.
- **TypeScript**.
- **Tailwind CSS 4**, con los colores, tipografías y espaciados del diseño en `tailwind.config.js`.
- **localStorage** del navegador para guardar favoritos y las noticias creadas o eliminadas.
- **JSON local** (`public/data/noticias.json`) como fuente de las noticias.
- **Google Fonts**: la tipografía Plus Jakarta Sans y los íconos Material Symbols se cargan desde ahí (están en `src/index.html`).
- **Vercel** para el despliegue.

## Cómo correr la aplicación en el computador

Se necesita [Node.js](https://nodejs.org/) en una versión reciente (Angular 22 pide la 22.22.3 o superior) y Git.

```bash
git clone https://github.com/Davidesc2023/techpulso-frontend.git
cd techpulso-frontend/techpulso-angular
npm install
npm start
```

Después se abre `http://localhost:4200/`. Si ya se tiene el Angular CLI instalado, `ng serve` hace lo mismo. Para generar la versión de producción:

```bash
npm run build
```

El resultado queda en `dist/techpulso-angular/browser`.

### Si se quiere ver el prototipo de la Entrega 2

Las páginas de la raíz del repositorio no se pueden abrir con doble clic, porque `noticias.html` lee el JSON con `fetch()` y los navegadores no lo permiten con archivos abiertos directamente. Hay que abrir la carpeta en Visual Studio Code y usar la extensión **Live Server** sobre `index.html`.

## Estructura de la aplicación Angular

```
techpulso-angular/
├── public/                  Archivos que se publican tal cual
│   ├── data/noticias.json   Las 6 noticias iniciales
│   ├── img/                 Imágenes de las noticias, de Inicio, de Detalle y del mapa
│   ├── sin-imagen.svg       Imagen para las noticias creadas sin foto
│   └── favicon.*, logo-techpulso.png
├── scripts/
│   └── descargar-imagenes.mjs
├── src/
│   ├── index.html
│   ├── styles.css           Activa Tailwind y enlaza tailwind.config.js
│   └── app/
│       ├── app.ts / app.html        Componente raíz: header, vista actual, footer y aviso
│       ├── app.routes.ts            Tabla de rutas
│       ├── app.config.ts            Router, desplazamiento y HttpClient
│       ├── header/  footer/  toast/ Componentes compartidos por todas las vistas
│       ├── home/  noticias/  detalle/  favoritos/  contacto/   Las cinco vistas
│       ├── noticia.ts               Modelos de datos (Noticia y Favorito)
│       ├── noticias.service.ts      Lee el JSON y maneja crear y eliminar noticias
│       ├── favoritos.service.ts     Guarda y entrega los favoritos
│       └── toast.service.ts         Maneja el aviso flotante
├── tailwind.config.js
└── vercel.json
```

Cada componente tiene su `.ts` (lógica), su `.html` (la plantilla) y su `.css`. El diseño casi todo está resuelto con clases de Tailwind en el HTML, por eso los `.css` están vacíos a propósito. El código que escribimos lleva comentarios en español explicando qué hace y por qué; los archivos que genera Angular y que no tocamos (por ejemplo los `.spec.ts`) no los comentamos.

## Cómo funcionan las partes principales

**Noticias.** `NoticiasService` trae las noticias de `data/noticias.json` con `HttpClient`. La vista las filtra por categoría y por el texto del buscador, y las reparte en páginas de 6. Las tarjetas se dibujan con un bloque `@for`.

**Mini CRUD.** El botón "+ Agregar Noticia" abre un formulario con título, categoría, imagen opcional y resumen. La noticia nueva aparece arriba del catálogo y se guarda en el navegador. Cada tarjeta tiene un ícono de papelera para eliminarla (pide confirmación). Como una página sin servidor no puede modificar `noticias.json`, las noticias del JSON que se eliminan solo se anotan como eliminadas y dejan de mostrarse.

**Favoritos.** `FavoritosService` guarda la noticia completa y el momento en que se guardó. Por eso el contador del header, la lista de Favoritos y el corazón de cada tarjeta siempre muestran lo mismo. Si se elimina una noticia, también se quita de favoritos.

**Contacto.** Es un formulario reactivo. Todos los campos son obligatorios, el nombre necesita al menos 3 letras, el correo debe tener formato válido (algo@algo.algo), el mensaje admite hasta 1000 caracteres (el contador se pone rojo desde 950) y hay que aceptar la política de privacidad. Cada campo muestra su error cuando se toca y queda mal, y al enviar bien aparece un aviso verde.

**Aviso flotante.** Lo que se confirma con un aviso (favorito guardado, noticia publicada, mensaje enviado) pasa por un único componente, `Toast`, que usan todas las vistas.

### Datos que guarda el navegador

| Clave de localStorage | Qué guarda |
|---|---|
| `techpulso_favoritos` | Las noticias favoritas. |
| `techpulso_noticias_creadas` | Las noticias que el usuario publicó. |
| `techpulso_noticias_eliminadas` | Los números de las noticias del JSON que eliminó. |

Para volver todo a cero se puede abrir las herramientas de desarrollo (F12), ir a Aplicación → Almacenamiento local y borrar esas claves, o escribir `localStorage.clear()` en la consola.

## Despliegue

La página se publica en **Vercel**, conectada a este repositorio. Cada vez que se sube un cambio a la rama `main`, Vercel vuelve a construir y publicar solo. En el proyecto de Vercel el *Root Directory* es `techpulso-angular`, para que no mire las páginas de la Entrega 2 que están en la raíz.

La configuración está en `techpulso-angular/vercel.json`. Como un archivo JSON no admite comentarios, aquí queda explicado:

| Campo | Para qué sirve |
|---|---|
| `framework` | Le dice a Vercel que es un proyecto Angular. |
| `buildCommand` | El comando que construye la página: `npm run build`. |
| `outputDirectory` | La carpeta que se publica: `dist/techpulso-angular/browser`. |
| `rewrites` | Si alguien abre o recarga una dirección como `/detalle`, Vercel devuelve la aplicación y Angular muestra la vista. Sin esto daría error 404, porque esa dirección no es un archivo. Los archivos que sí existen (imágenes, el JSON) se entregan como siempre. |

## Imágenes

Las imágenes del diseño venían de enlaces externos de Google y uno de ellos dejó de funcionar, así que las descargamos y las guardamos dentro del proyecto (`public/img/`). Para eso hicimos el script `scripts/descargar-imagenes.mjs`: busca los enlaces externos en el código, baja cada imagen y cambia el enlace por la ruta local. Se usa desde la carpeta `techpulso-angular`:

```bash
node scripts/descargar-imagenes.mjs --listar   # solo muestra qué encontró
node scripts/descargar-imagenes.mjs            # descarga y cambia los enlaces
```

## Limitaciones conocidas

Cosas que sabemos que no están terminadas o que funcionan a medias:

- En Detalle el botón "Eliminar noticia" es simulado: ese artículo es fijo y no es una de las noticias del catálogo.
- El selector "Ordenar por" del catálogo es solo visual y no cambia el orden.
- Los marcadores de las tarjetas de Inicio solo cambian de aspecto; esas noticias no están en `noticias.json`, así que no se pueden guardar en favoritos.
- Ningún formulario (contacto, contactar al autor, boletín) envía los datos a un servidor, porque no hay uno. Solo validan y muestran la confirmación.
- La imagen del mapa de Contacto es un mapa de Madrid, aunque los textos de la sede dicen Bogotá. Los datos de contacto son de ejemplo.
- En las páginas de la Entrega 2 el logo del encabezado está roto, porque venía de uno de los enlaces externos que dejaron de funcionar.
- Las pruebas automáticas que genera Angular no las usamos.

## Integrantes

- David Esteban Sanguino Cetina
- Julio Carrasquilla Marin
- Sebastian Posada Moreno
- Jony Yara Quilindo

Módulo Front-End, tutor John Olarte. Politécnico Gran Colombiano, 2026.
