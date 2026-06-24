# 🎨 03. La Evolución del Diseño (UI/UX)

Desde el principio tuvimos claro que TalentUP no podía ser un triste excel con noticias. Tenía que transmitir *Vanguardia* y *Profesionalidad*. 

## Fase 1: El Modo Oscuro y el "Bento Box"
Nuestra primera iteración de éxito fue un rediseño radical inspirado en el mundo *SaaS* y *Web3*:
- Implementamos el concepto de **Bento Box**: Tarjetas cuadradas con bordes muy redondeados (`rounded-[2rem]`) que empaquetaban la información como si fuesen cajitas de comida japonesa.
- Usamos un **Modo Oscuro Puro** (`bg-slate-900`) con luces de neón en los bordes y botones (azul, rojo y verde).
- Resultaba espectacular, pero descubrimos un problema: **la fatiga visual**. Para una web donde el objetivo es *leer noticias*, el fondo negro brillante cansa mucho la vista.

## Fase 2: Inspiración Google I/O y Glassmorphism
Decidimos pivotar la estética hacia algo más "corporativo pero moderno", tomando como inspiración directa la página oficial de *Google I/O*.

- **Glassmorphism (Efecto Cristal)**: En lugar de tarjetas sólidas, creamos paneles de cristal translúcido (`backdrop-blur-xl`). 
- **Fondo con Focos de Luz**: Para que el cristal se notase, pusimos un fondo blanco roto (`bg-slate-50`) con gigantescos "focos" de colores pastel desenfocados (azul, rojo y amarillo de Google) escondidos en el fondo. Al hacer scroll, los paneles de cristal difuminan estos colores creando una sensación 3D mágica.
- **Tipografía**: Incorporamos la fuente `Outfit` para los titulares, dándole un peso extremo (`font-extrabold`) que denota muchísima personalidad y modernidad.

## Iteraciones Finales (UX)
- **Eliminación de la fatiga de clics**: El logo actúa como botón de "Inicio".
- **Resumen en Viñetas**: Quitamos los densos párrafos descriptivos y programamos el "Resumen Diario" para que mostrara una lista de puntos clave directa y al grano.
