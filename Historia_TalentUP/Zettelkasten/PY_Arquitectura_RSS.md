# PY: Arquitectura de Extracción RSS

**Etiquetas:** #python #backend #scraping #rss

## El Motor
En lugar de hacer Web Scraping tradicional (que es lento y suele romperse por bloqueos antibot), usamos RSS, el protocolo universal de distribución de noticias.

## Librerías Fundamentales
El script depende de dos librerías externas que instalamos en el servidor vía `pip`:
- `requests`: Para hacer las llamadas HTTP (GET) al servidor de Google. Le inyectamos una cabecera (`User-Agent`) para fingir que somos un navegador Chrome de Windows y evitar bloqueos preventivos.
- `feedparser`: Una librería especializada en Python que coge la "sopa de letras" de un XML y la convierte en un diccionario de objetos navegable y ordenado.

## Estructura del Bucle
```python
for entry in feed.entries[:15]:
    title = getattr(entry, 'title', 'Sin título')
    link = getattr(entry, 'link', '#')
```
Cortamos en `[:15]` para limitar el payload JSON y garantizar que la web cargue casi instantáneamente en teléfonos móviles antiguos.

## Relaciones
- [[PY_Consultas_Google]]
