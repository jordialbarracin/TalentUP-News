# 🚀 05. Roadmap y Posible Futuro

TalentUP está 100% operativo en su versión 1.0 (Cloud). Pero la arquitectura está diseñada para poder evolucionar enormemente sin tirar el código a la basura.

Estas son las ideas documentadas que podríamos implementar si en el futuro queremos escalar el proyecto:

## 1. NLP Integrado para Resúmenes Reales
Actualmente, el "Resumen Diario" toma los títulos de las 3 últimas noticias. 
**Idea**: Conectar el script de Python a un modelo de lenguaje ligero en la nube (ej: Google Gemini Free API o LLaMA a través de Groq) para que *lea* los textos completos de los 30 artículos recopilados y genere 3 *bullets* analíticos reales. 

## 2. Hemeroteca y Buscador
A medida que GitHub Actions vaya ejecutando el bot, el archivo `noticias.js` acumulará miles de noticias.
**Idea**: 
- Limitar la carga de la página principal a las últimas 100 noticias para no ralentizar el navegador.
- Añadir un cuadro de búsqueda de texto completo con Javascript para que el usuario filtre el historial localmente.

## 3. Notificaciones Push y Alertas (Sistema Push)
Dado que el script se ejecuta en un servidor remoto de GitHub, no tenemos por qué limitar el *output* a solo pintar la web.
**Idea**: Si el script detecta palabras clave configuradas como "Alta prioridad" (ej: *Reforma Laboral Urgente*), puede usar una librería de Python para enviar un mensaje instantáneo a un Bot de Telegram o un Slack corporativo.
