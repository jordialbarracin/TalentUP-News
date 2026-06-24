# CSS: Glassmorphism Puro (Tailwind)

**Etiquetas:** #css #tailwind #glassmorphism #diseño

## Concepto
El "Glassmorphism" es la tendencia actual de interfaces donde los elementos parecen ser paneles de cristal esmerilado flotando sobre fondos coloridos (muy usado por Apple en macOS y visionOS).

## La Fórmula Exacta en Tailwind
Para lograr un cristal perfecto que no reste legibilidad a los textos, la combinación mágica que usamos en las tarjetas de TalentUP es:
`bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl`

**Desglose técnico:**
- `bg-white/80`: Un fondo blanco al 80% de opacidad. Suficientemente sólido para leer letras negras por encima, pero con un 20% de transparencia.
- `backdrop-blur-xl`: El motor del efecto. Ordena al navegador que coja lo que sea que haya *detrás* del panel y le aplique un difuminado gaussiano masivo.
- `border border-slate-200`: Un marco gris finísimo (1px) que simula el borde de la "luna de cristal".

## Importancia del Fondo
El cristal solo se ve si hay algo detrás. Por eso esta técnica requirió la implementación paralela de focos de luz decorativos en el fondo de la página web.

## Relaciones
- [[CSS_Focos_Fondo]]
