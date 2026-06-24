# PY: Escritura de Base de Datos (Flat-File)

**Etiquetas:** #python #json #basededatos

## Escritura Física
El último paso de `rastreador.py` es consolidar la memoria RAM en el disco duro.

```python
DB_PATH = os.path.join(os.path.dirname(__file__), 'datos', 'noticias.js')
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
```
1. Usamos `os.path.join` y `__file__` para garantizar que la ruta sea relativa (que funcione tanto en el C:/ del ordenador local de Jordi como en los servidores Linux `/home/runner/` de GitHub).
2. `os.makedirs` se asegura de crear la carpeta `datos/` si no existe previamente.

## Serialización JS Segura
```python
with open(DB_PATH, 'w', encoding='utf-8') as f:
    f.write("const window_news_data = " + json.dumps(todas_las_noticias, ensure_ascii=False, indent=2) + ";")
```
Se aplica `ensure_ascii=False` para que caracteres como la 'ñ' o los acentos ('á') se guarden correctamente en UTF-8 en lugar de su código unicode feo `\u00f1`.

## Relaciones
- [[JS_Inyeccion_Segura]]
