# CSS: Focos de Luz de Fondo (Orbes)

**Etiquetas:** #css #tailwind #glassmorphism

## Concepto
Para que el Glassmorphism funcione en una web en Modo Claro, el fondo no puede ser completamente blanco puro, de lo contrario los cristales no tendrían color que refractar.

## Implementación
Justo después de abrir la etiqueta `<body>`, inyectamos 3 `<div>` decorativos con posicionamiento fijo:

```html
<div class="fixed top-[-10%] left-[-10%] w-96 h-96 bg-google-blue/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
<div class="fixed bottom-[10%] right-[-10%] w-[40rem] h-[40rem] bg-google-red/5 rounded-full blur-[150px] pointer-events-none z-[-1]"></div>
<div class="fixed top-[40%] left-[20%] w-[30rem] h-[30rem] bg-google-yellow/5 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
```

**Claves del Efecto:**
- **Desenfoque extremo**: `blur-[120px]` y `blur-[150px]`. Convierte un círculo sólido en una nube de gas.
- **Opacidad hiper-baja**: `bg-google-blue/10` (10%). Garantiza que la mancha sea súper sutil y elegante, no un borrón molesto.
- **Anticolisiones**: `pointer-events-none z-[-1]`. Asegura que el foco esté por debajo de la web y no bloquee que el usuario haga clic en enlaces o seleccione texto.

## Relaciones
- [[CSS_Glassmorphism_Puro]]
