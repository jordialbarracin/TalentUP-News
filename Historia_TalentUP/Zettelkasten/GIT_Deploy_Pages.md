# GIT: Despliegue Estático con Pages

**Etiquetas:** #git #cloud #hosting

## Concepto
Alojamiento Serverless. En lugar de pagar una instancia de AWS o Vercel para servir 3 archivos estáticos (html, js, css), usamos GitHub Pages.

## El Ciclo Automático
Lo brillante de esta arquitectura es su efecto dominó natural:
1. El bot de GitHub Actions se despierta, cambia el `noticias.js` y hace un `git push`.
2. Como GitHub detecta que se ha hecho un Push en la rama `main`, y sabe que tenemos Pages activado escuchando a esa rama, automáticamente arranca un *segundo* proceso (Pages Build and Deployment).
3. Ese proceso coge todos nuestros archivos, los empaqueta, los limpia y los lanza a `jordialbarracin.github.io/TalentUP`.

De este modo, programar el backend fue todo lo que tuvimos que hacer. El frontend se actualiza gratis como consecuencia (side-effect) de la subida de datos.
