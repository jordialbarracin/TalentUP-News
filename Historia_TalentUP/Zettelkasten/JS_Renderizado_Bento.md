# JS: Renderizado Estilo Bento Box

**Etiquetas:** #javascript #ui #bento #frontend

## Concepto
El renderizado Bento Box consiste en generar tarjetas HTML de forma dinámica a partir de un Array de datos JSON (`window_news_data`). 

## Implementación
En `app.js`, la función `renderNews(newsArray)` se encarga de:
1. Vaciar el contenedor principal (`grid.innerHTML = ''`).
2. Iterar sobre cada noticia usando un `forEach`.
3. Crear un elemento `<div>` al vuelo con clases de Tailwind extremas para redondear bordes y aplicar fondos translúcidos:
   `class="group flex flex-col h-full bg-white/80 backdrop-blur-md rounded-[2rem] border border-slate-200 shadow-sm ..."`

## Truco de Limpieza de Texto
A veces los feeds RSS traen código HTML sucio (`<b>`, `<p>`). En Javascript, lo limpiamos creando un DIV fantasma temporal en la memoria (nunca se añade a la web):
```javascript
const tmp = document.createElement("DIV");
tmp.innerHTML = item.resumen;
const cleanSummary = tmp.textContent || tmp.innerText || "";
```
De esta forma, aseguramos que el diseño Bento no se rompa por culpa de etiquetas HTML rotas.

## Relaciones
- [[JS_Filtrado_Categorias]]
- [[CSS_Glassmorphism_Puro]]
