# Proyecto: Automatización de Diario de Noticias RRHH

Este documento sirve como base de conocimiento para el desarrollo del proyecto de un agregador automático de noticias del sector de Recursos Humanos. Se recomienda mantener esta estructura en Obsidian para documentar el progreso, las decisiones técnicas y la evolución de la idea.

## 1. Visión y Propósito del Proyecto
- **Objetivo Principal**: Crear un agregador público de noticias de RRHH (automatizado).
- **Problema a resolver**: La información sobre recursos humanos, selección de personal y cambios legales está descentralizada, lo que hace perder tiempo a los trabajadores de ETTs y consultorías.
- **Solución**: Un "diario" centralizado que rastrea automáticamente la red y presenta titulares, resúmenes cortos y enlaces directos a las fuentes originales.
- **Formato de Consumo**: Un Producto Mínimo Viable (MVP) en formato web responsiva, diseñado desde el inicio para dar el salto a aplicación móvil.

## 2. Arquitectura Tecnológica (El Stack "No-Code")
Para mantener un coste inicial de 0€ (Uso de planes gratuitos), utilizaremos las siguientes herramientas interconectadas:
- **El Combustible (Fuentes)**: Tecnología RSS de páginas clave del sector.
- **El Cerebro (Make.com)**: Actúa como el motor de automatización. Se encarga de rastrear las fuentes 24/7, extraer la información nueva y enviarla a la base de datos.
- **La Memoria (Airtable)**: Funciona como la base de datos. Almacenará de forma estructurada el título, el resumen, la imagen, la URL original, la fecha y la categoría de cada noticia.
- **El Escaparate (Softr o Glide)**: Actúa como el Front-end Web/App. Lee la información de Airtable y la presenta al usuario final con un diseño atractivo, buscador y filtros.

## 3. Fuentes de Información Iniciales
El sistema se alimentará de medios consolidados para garantizar la calidad del contenido desde el día uno:
- **Legislación**: BOE (RSS de normativa laboral) y Ministerio de Trabajo.
- **Mercado**: Randstad Research y Blog de Empresas de InfoJobs.
- **Sectorial**: RRHH Digital y Equipos y Talento.

## 4. Estructura de Obsidian (Gestión del Proyecto)
- **00_Proyecto_Principal**: Contiene este documento maestro y el modelo de negocio/idea.
- **01_Bitacora_Sesiones**: Notas por cada sesión de chat (con fecha) con el resumen de lo conversado.
- **02_Fuentes_y_RSS**: Lista de las fuentes (blogs, periódicos, sitios gubernamentales).
- **03_Arquitectura_Tecnica**: Documentación sobre la configuración.
- **04_MVP_Roadmap**: Lista de tareas y objetivos.

## 5. Flujo de Trabajo para el Usuario (Mantenimiento)
Como usuario, tu rol será supervisar que el sistema (Make.com) esté extrayendo correctamente la información de las fuentes. Si detectas que una fuente deja de ser relevante, el procedimiento es:
1. Ir a la nota `02_Fuentes_y_RSS/Fuentes.md` en Obsidian.
2. Añadir o eliminar la URL del feed RSS.
3. Actualizar la configuración en Make.com para reflejar el cambio.

## 6. Recomendaciones de Registro de Sesiones
Cada vez que cerremos una sesión, te sugiero añadir en tu nota diaria de Obsidian:
- **Qué logramos**: Qué parte de la arquitectura quedó configurada.
- **Bloqueos**: Cualquier duda técnica que surja al configurar Make.com o Airtable.
- **Próximos pasos**: Qué es lo siguiente que debemos ejecutar.
