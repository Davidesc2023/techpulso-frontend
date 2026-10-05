/*
  TechPulso - app.routes.ts (tabla de rutas)
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Dice qué componente se muestra según la dirección del navegador. Es el
  equivalente en Angular de los enlaces entre archivos .html de la
  Entrega 2. El componente elegido se dibuja en <router-outlet /> de
  app.html, entre el header y el footer.
*/
import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Noticias } from './noticias/noticias';
import { Detalle } from './detalle/detalle';
import { Favoritos } from './favoritos/favoritos';
import { Contacto } from './contacto/contacto';

export const routes: Routes = [
  // Dirección vacía (http://localhost:4200/): vista de Inicio
  { path: '', component: Home },
  // http://localhost:4200/noticias: catálogo de noticias
  { path: 'noticias', component: Noticias },
  // http://localhost:4200/detalle: detalle de una noticia (dirección fija)
  { path: 'detalle', component: Detalle },
  // http://localhost:4200/favoritos: noticias guardadas
  { path: 'favoritos', component: Favoritos },
  // http://localhost:4200/contacto: formulario de contacto
  { path: 'contacto', component: Contacto },
  // Cualquier otra dirección que no exista vuelve a la vista de Inicio
  { path: '**', redirectTo: '' },
];
