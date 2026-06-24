# PY: Inyección de Consultas (Google Dorks)

**Etiquetas:** #python #osint #google

## Concepto
No podemos confiar en que Google News sepa qué es importante en Recursos Humanos por defecto. Tuvimos que usar técnicas de OSINT (Inteligencia de Fuentes Abiertas) inyectando sintaxis booleana directamente en la URL.

## Anatomía de la Query
```python
q3 = urllib.parse.quote('"empresas de trabajo temporal" OR "ETT" OR Adecco OR Randstad OR Manpower OR Eurofirms when:7d')
```

1. **Uso de Comillas `""`**: Fuerza a Google a buscar la frase literal exacta ("empresas de trabajo temporal"), eliminando noticias irrelevantes sobre el temporal de lluvias o trabajo de campo.
2. **Uso del Operador `OR`**: Crea un embudo masivo. Si la noticia contiene el nombre de cualquiera de las ETTs principales, la captura.
3. **El Operador Temporal `when:7d`**: Restringe los resultados a la última semana natural. Es crucial para que TalentUP no repita noticias de 2021.
4. **`urllib.parse.quote()`**: Convierte los espacios y comillas en código de URL (ej. `%20`) para que el servidor de Google no lance un error 400.
