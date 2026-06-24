# Arquitectura Técnica

## Tech Stack
- **Base de Datos**: Airtable
- **Automatización**: Make.com
- **Front-end Web/App**: Softr

## Configuración Airtable

### Tabla 1: Fuentes
Esta tabla servirá como directorio de los medios que alimentan el sistema.
* **Nombre de la Fuente** (Tipo: `Single line text`) - *Campo Primario*
* **Categoría** (Tipo: `Single select` -> Opciones: Legislación, Mercado, Sectorial)
* **URL RSS** (Tipo: `URL`) - El enlace del feed.
* **URL Sitio Web** (Tipo: `URL`) - Enlace a la web principal.
* **Activo** (Tipo: `Checkbox`) - Para activar o pausar la extracción sin borrar el registro.
* **Noticias** (Tipo: `Link to another record` -> Apunta a la tabla "Noticias")

### Tabla 2: Noticias
Esta es la tabla principal donde Make.com volcará todo el contenido.
* **Título** (Tipo: `Single line text`) - *Campo Primario*
* **Resumen** (Tipo: `Long text`)
* **URL Original** (Tipo: `URL`)
* **Fecha de Publicación** (Tipo: `Date` -> Incluir hora)
* **Imagen** (Tipo: `Attachment`) - Si el RSS proporciona portada.
* **Fuente** (Tipo: `Link to another record` -> Apunta a la tabla "Fuentes")
* **Categoría** (Tipo: `Lookup` -> Extrae la "Categoría" desde la tabla Fuentes)
* **Estado** (Tipo: `Single select` -> Opciones: Publicado, Pendiente, Descartado) - Útil para moderar si fuera necesario.

## Configuración Make.com
*(Pendiente de documentar)*

## Configuración Softr
*(Pendiente de documentar)*
