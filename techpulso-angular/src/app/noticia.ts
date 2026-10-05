/*
  TechPulso - noticia.ts (modelo de datos)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Define la forma de los datos que usa la aplicación. Una "Noticia" es
  cada elemento del archivo noticias.json; un "Favorito" es una noticia
  guardada por el usuario junto con el momento en que la guardó.
*/

// Una noticia, con los mismos campos que tiene noticias.json.
export interface Noticia {
  // Número único de la noticia.
  id: number;
  // Categoría escrita en minúsculas, sin tildes: tecnologia, educativas,
  // turisticas o comerciales (se usa para filtrar y para el color).
  categoria: string;
  // Nombre de la categoría tal como se muestra en pantalla.
  categoriaLabel: string;
  // Dirección de la imagen de la noticia.
  imagen: string;
  // Texto de cuándo se publicó, por ejemplo "Hace 2 horas".
  tiempo: string;
  // Tiempo de lectura, por ejemplo "4 min".
  lectura: string;
  // Título de la noticia.
  titulo: string;
  // Descripción breve.
  descripcion: string;
  // Nombre del autor.
  autor: string;
  // Iniciales del autor, para el círculo que acompaña su nombre.
  autorIniciales: string;
}

// Una noticia guardada en favoritos.
export interface Favorito {
  // La noticia guardada (se guarda completa para poder mostrarla sin
  // volver a leer noticias.json).
  noticia: Noticia;
  // Momento en que se guardó, en milisegundos (resultado de Date.now()).
  guardadoEn: number;
}
