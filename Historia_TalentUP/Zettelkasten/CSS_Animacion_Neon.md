# CSS: Animación Neón Original (Descartado)

**Etiquetas:** #css #historia #animacion #neon

## Contexto Histórico
Antes de migrar al diseño Google I/O en Modo Claro, TalentUP operaba en un Dark Mode profundo (`bg-slate-900`). El reto era atraer la atención del usuario hacia tarjetas destacadas.

## El Efecto Neón
Para el panel principal, diseñamos una animación en CSS puro que simulaba un láser de luz dando vueltas por el borde de la caja.

**El Código Original en estilos.css:**
```css
@keyframes borderGlow {
    0%, 100% { border-color: #4285f4; box-shadow: 0 0 15px rgba(66, 133, 244, 0.3); }
    33% { border-color: #ea4335; box-shadow: 0 0 15px rgba(234, 67, 53, 0.3); }
    66% { border-color: #fbbc05; box-shadow: 0 0 15px rgba(251, 188, 5, 0.3); }
}

.neon-border {
    animation: borderGlow 6s infinite;
}
```

## Por qué se descartó
Aunque visualmente era impactante (muy Cyberpunk/Web3), generaba demasiada fatiga visual tras 5 minutos de lectura. La transición al Glassmorphism demostró que, para una herramienta de lectura de noticias diaria, la sutileza retiene mejor la atención del usuario a largo plazo.
