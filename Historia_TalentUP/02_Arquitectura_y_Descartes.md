# 🏗️ 02. Evolución Arquitectónica y Descartes

El camino para construir TalentUP no fue una línea recta. Tuvimos que pivotar varias veces para encontrar la arquitectura perfecta, primando siempre la **independencia** y el **coste cero**.

## ❌ La Idea Original Descartada: Herramientas No-Code
Al principio, nos planteamos usar un stack puramente *No-Code*:
- **Make.com / Zapier**: Para automatizar la recolección de noticias.
- **Airtable**: Como base de datos y visor (Interfaz gráfica).

### ¿Por qué lo descartamos?
1. **Límites de Pago**: Make.com y Airtable tienen límites muy estrictos en sus versiones gratuitas. Un agregador de noticias consume cientos de "operaciones" al mes, lo que nos habría forzado a pagar suscripciones mensuales rápidas.
2. **Limitaciones de Diseño**: Las interfaces gráficas de Airtable son funcionales, pero no son "espectaculares". Estábamos atados a sus cuadrículas aburridas y queríamos un diseño "Premium" que dejara con la boca abierta.

## ✅ El Pivot: Código Propio y Serverless
Decidimos que la única forma de tener control absoluto y 0€ de coste era programarlo nosotros mismos. La arquitectura final se cerró así:

1. **El Motor (Backend)**: Un pequeño script de Python (`rastreador.py`) usando herramientas nativas.
2. **La Base de Datos**: ¡No hay servidor de base de datos! El script de Python escupe un archivo llamado `noticias.js` que el navegador puede leer directamente. Esto se llama arquitectura "Flat-file" o "Server-rendered data".
3. **La Nube (El Orquestador)**: En lugar de dejar el ordenador encendido localmente, usamos **GitHub Actions**. Es una herramienta pensada para testear software, pero la hemos "hackeado" para que ejecute nuestro script de Python cada 6 horas y actualice la web de GitHub Pages.

**Conclusión:** Pasamos de un sistema frágil de suscripciones a un ecosistema de código puro, indestructible y totalmente autónomo.
