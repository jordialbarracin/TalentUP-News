# JS: Algoritmo de Filtrado de Categorías

**Etiquetas:** #javascript #filtros #ux

## Concepto
Teníamos 3 categorías distintas (Leyes, Mercado, ETTs). Necesitábamos que al hacer clic en un botón, la pantalla se limpiara y mostrara solo esas noticias, sin recargar la página.

## Implementación
1. **Identificación**: Todos los botones de filtro comparten la clase `filter-btn` y tienen un atributo HTML personalizado: `data-categoria="Mercado"`.
2. **Event Listener Central**: En lugar de hacer una función para cada botón, usamos una función global `applyFilter(category)`.
3. **El Filtrado de Array**: 
   ```javascript
   if (category === 'todas') {
       renderNews(allNews, 'todas');
   } else {
       const filtered = allNews.filter(n => n.categoria === category);
       renderNews(filtered, category);
   }
   ```
   Javascript usa el método nativo `.filter()` que es rapidísimo.

## El Botón "Home" Escondido
Para mejorar la usabilidad (UX), hicimos que el H1 con el título principal `TalentUP` ejecutase secretamente la misma función `applyFilter('todas')`. Esto permite eliminar el redundante botón "Inicio" o "Actualidad" de la barra de navegación.

## Relaciones
- [[JS_Renderizado_Bento]]
