# JS: Flat-File DB y el truco "window_news_data"

**Etiquetas:** #javascript #backend #seguridad #cors

## El Problema del CORS Local
Inicialmente, queríamos que `app.js` hiciese una llamada `fetch('datos/noticias.json')`.
El problema es que, por motivos de seguridad, los navegadores bloquean el uso de `fetch` a archivos locales (protocolo `file:///`). Esto provocaba un error de CORS (Cross-Origin Resource Sharing) si el usuario abría el archivo `index.html` haciendo doble clic desde el Escritorio.

## La Solución Magistral
En lugar de forzar al usuario a levantar un servidor local (`python -m http.server`), hackeamos el formato de la base de datos:

1. El motor de Python ya no genera un `.json` puro.
2. Genera un archivo `.js` (Javascript) y le asigna los datos JSON a una variable global inmutable:
   ```javascript
   const window_news_data = [ {titulo: "Noticia", ...} ];
   ```
3. En el `index.html`, importamos ese archivo como un script normal:
   `<script src="datos/noticias.js"></script>`

Al hacer esto, la variable `window_news_data` pasa a existir mágicamente en la memoria de la web de forma instantánea, eludiendo todos los bloqueos del navegador y cargando los datos a la velocidad de la luz.

## Relaciones
- [[PY_Flat_File_Database]]
