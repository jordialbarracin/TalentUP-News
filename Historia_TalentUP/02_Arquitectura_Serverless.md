# 🏗️ 02. Arquitectura Serverless

La arquitectura de TalentUP ha sido diseñada bajo el paradigma **Serverless** (sin servidor dedicado), priorizando la **independencia operativa**, el **alto rendimiento** y el **coste cero de mantenimiento**.

## Componentes de la Arquitectura

1. **El Motor de Rastreo (Backend en Python)**: 
   El núcleo de recolección de datos es un script optimizado de Python (`rastreador.py`). Utiliza herramientas nativas para conectarse a endpoints RSS y extraer la información en tiempo real, aplicando algoritmos de limpieza de texto.

2. **La Base de Datos (Flat-File / Server-rendered data)**: 
   Para eliminar la dependencia de bases de datos relacionales tradicionales (SQL) y evitar los altos tiempos de latencia, se emplea una arquitectura *Flat-file*. El motor de Python serializa los datos y los inyecta directamente en un archivo estático de configuración (`noticias.js`). Esto permite que el navegador del usuario final cargue los datos de manera instantánea y local, eludiendo problemas de CORS o sobrecarga de base de datos.

3. **El Orquestador Cloud (GitHub Actions)**: 
   El despliegue continuo (CI/CD) se gestiona mediante GitHub Actions. Un temporizador Cron en la nube despierta un servidor virtual (Ubuntu) cada 6 horas, ejecuta el motor de recolección de Python, consolida la nueva base de datos y la despliega automáticamente.

4. **El Alojamiento (GitHub Pages)**:
   El Frontend estático es servido a través de la CDN global de GitHub Pages, asegurando un 100% de *uptime* y una latencia mínima para los usuarios en cualquier parte del mundo.

**Conclusión:** El resultado es un ecosistema de código puro, robusto, altamente escalable y totalmente autónomo.
