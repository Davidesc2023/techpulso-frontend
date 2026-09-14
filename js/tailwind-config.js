/*
  TechPulso - Configuración de Tailwind CSS
  Politécnico Gran Colombiano - Módulo Front-End - Grupo B02 / Subgrupo 26

  Este archivo define la paleta de colores, la tipografía y los espaciados
  que usamos en las 5 vistas (Inicio, Noticias, Detalle, Favoritos y Contacto).
  Lo dejamos en un solo lugar para no repetir la misma configuración en
  cada página; cualquier ajuste de color o tipografía se hace acá y se
  refleja en todo el sitio.

  Se carga DESPUÉS del script de Tailwind (cdn.tailwindcss.com) en el
  <head> de cada HTML, por eso el orden de los <script> importa.
*/
tailwind.config = {
    darkMode: "class",
    theme: {
      extend: {
        "colors": {
          "primary": "#004ac6",
          "on-tertiary-fixed": "#002113",
          "secondary-fixed": "#acedff",
          "primary-fixed": "#dbe1ff",
          "outline-variant": "#c3c6d7",
          "on-primary-fixed": "#00174b",
          "on-secondary-fixed": "#001f26",
          "surface-container-highest": "#dae2fd",
          "on-error": "#ffffff",
          "inverse-primary": "#b4c5ff",
          "inverse-on-surface": "#eef0ff",
          "on-secondary": "#ffffff",
          "surface-container-low": "#f2f3ff",
          "surface-bright": "#faf8ff",
          "background": "#faf8ff",
          "surface-container": "#eaedff",
          "error-container": "#ffdad6",
          "error": "#ba1a1a",
          "surface-dim": "#d2d9f4",
          "secondary-fixed-dim": "#4cd7f6",
          "surface-container-high": "#e2e7ff",
          "surface-tint": "#0053db",
          "on-tertiary": "#ffffff",
          "tertiary-fixed": "#6ffbbe",
          "on-surface": "#131b2e",
          "on-primary": "#ffffff",
          "surface-container-lowest": "#ffffff",
          "tertiary-fixed-dim": "#4edea3",
          "on-primary-fixed-variant": "#003ea8",
          "surface": "#faf8ff",
          "primary-container": "#2563eb",
          "inverse-surface": "#283044",
          "on-tertiary-fixed-variant": "#005236",
          "outline": "#737686",
          "tertiary": "#006242",
          "on-primary-container": "#eeefff",
          "on-background": "#131b2e",
          "on-error-container": "#93000a",
          "on-tertiary-container": "#bdffdb",
          "on-surface-variant": "#434655",
          "secondary-container": "#57dffe",
          "on-secondary-container": "#006172",
          "surface-variant": "#dae2fd",
          "tertiary-container": "#007d55",
          "on-secondary-fixed-variant": "#004e5c",
          "secondary": "#00687a",
          "primary-fixed-dim": "#b4c5ff"
        },
        "borderRadius": {
          "DEFAULT": "0.25rem",
          "lg": "0.5rem",
          "xl": "0.75rem",
          "full": "9999px"
        },
        "spacing": {
          "gutter-sm": "1rem",
          "gutter": "1.5rem",
          "space-sm": "0.5rem",
          "gutter-lg": "2rem",
          "margin": "1.5rem",
          "margin-sm": "1rem",
          "space-xs": "0.25rem",
          "space-xl": "2.5rem",
          "space-md": "1rem",
          "space-lg": "1.5rem",
          "margin-lg": "3rem"
        },
        "fontFamily": {
          "caption": [
            "Plus Jakarta Sans"
          ],
          "body-lead": [
            "Plus Jakarta Sans"
          ],
          "label-md": [
            "Plus Jakarta Sans"
          ],
          "headline-lg": [
            "Plus Jakarta Sans"
          ],
          "display-hero-mobile": [
            "Plus Jakarta Sans"
          ],
          "body-base": [
            "Plus Jakarta Sans"
          ],
          "body-sm": [
            "Plus Jakarta Sans"
          ],
          "display-hero": [
            "Plus Jakarta Sans"
          ],
          "headline-xl-mobile": [
            "Plus Jakarta Sans"
          ],
          "headline-xl": [
            "Plus Jakarta Sans"
          ],
          "headline-md": [
            "Plus Jakarta Sans"
          ],
          "label-sm": [
            "Plus Jakarta Sans"
          ],
          "headline-sm": [
            "Plus Jakarta Sans"
          ]
        },
        "fontSize": {
          "caption": [
            "0.75rem",
            {
              "lineHeight": "1.4",
              "letterSpacing": "0.01em",
              "fontWeight": "400"
            }
          ],
          "body-lead": [
            "1.125rem",
            {
              "lineHeight": "1.65",
              "letterSpacing": "-0.005em",
              "fontWeight": "400"
            }
          ],
          "label-md": [
            "0.875rem",
            {
              "lineHeight": "1.2",
              "letterSpacing": "0.01em",
              "fontWeight": "600"
            }
          ],
          "headline-lg": [
            "2rem",
            {
              "lineHeight": "1.2",
              "letterSpacing": "-0.02em",
              "fontWeight": "700"
            }
          ],
          "display-hero-mobile": [
            "2.25rem",
            {
              "lineHeight": "1.2",
              "letterSpacing": "-0.02em",
              "fontWeight": "800"
            }
          ],
          "body-base": [
            "1rem",
            {
              "lineHeight": "1.6",
              "letterSpacing": "0em",
              "fontWeight": "400"
            }
          ],
          "body-sm": [
            "0.875rem",
            {
              "lineHeight": "1.5",
              "letterSpacing": "0.005em",
              "fontWeight": "400"
            }
          ],
          "display-hero": [
            "3.5rem",
            {
              "lineHeight": "1.1",
              "letterSpacing": "-0.03em",
              "fontWeight": "800"
            }
          ],
          "headline-xl-mobile": [
            "1.75rem",
            {
              "lineHeight": "1.25",
              "letterSpacing": "-0.02em",
              "fontWeight": "700"
            }
          ],
          "headline-xl": [
            "2.5rem",
            {
              "lineHeight": "1.15",
              "letterSpacing": "-0.025em",
              "fontWeight": "700"
            }
          ],
          "headline-md": [
            "1.5rem",
            {
              "lineHeight": "1.3",
              "letterSpacing": "-0.015em",
              "fontWeight": "600"
            }
          ],
          "label-sm": [
            "0.75rem",
            {
              "lineHeight": "1.2",
              "letterSpacing": "0.04em",
              "fontWeight": "600"
            }
          ],
          "headline-sm": [
            "1.25rem",
            {
              "lineHeight": "1.35",
              "letterSpacing": "-0.01em",
              "fontWeight": "600"
            }
          ]
        }
      },
    },
  }
