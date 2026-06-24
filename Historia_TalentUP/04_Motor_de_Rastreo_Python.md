# ⚙️ 04. Las Entrañas del Motor: Rastreador Python

El "corazón" de TalentUP es un archivo de 100 líneas llamado `rastreador.py`.

## ¿Cómo funciona sin IA Cognitiva?
En lugar de pagar caras llamadas a APIs de OpenAI o Claude para que "lean" internet, usamos **OSINT (Open Source Intelligence)** básico.

Hemos atacado directamente a los *endpoints* RSS de Google News.
Google News permite hacer consultas (queries) mediante URL. Le inyectamos operadores booleanos avanzados:

```python
# Ejemplo de nuestra consulta matemática a Google:
q3 = urllib.parse.quote('"empresas de trabajo temporal" OR "ETT" OR Adecco OR Randstad OR Manpower OR Eurofirms when:7d')
```

- Con `when:7d` forzamos a que solo nos traiga la más estricta actualidad.
- Con el uso de comillas `" "` y el operador `OR`, cubrimos todas las variaciones léxicas sin necesidad de una red neuronal.

## Manejo de Excepciones
El script usa la librería `feedparser` y `requests` para descargar los XML. Formatea la fecha y extrae los resúmenes limpiando la basura de HTML que a veces inyectan los periódicos.

## El Truco del Flat-File
Normalmente, Python guardaría esto en un archivo `.json`. Pero si una web local intenta leer un `.json` con Javascript, el navegador lo bloquea por razones de seguridad (Error CORS). 

¿Nuestro *Hack*? Hacemos que Python guarde los datos como un archivo de Javascript (`noticias.js`) inyectando directamente una variable global:
`const window_news_data = [...];`

Así, nuestro Frontend lee los datos instantáneamente como si fuesen parte del propio código fuente de la página. Rápido, seguro y sin base de datos.
