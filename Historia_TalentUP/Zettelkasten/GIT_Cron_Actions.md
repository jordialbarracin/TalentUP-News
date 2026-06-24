# GIT: GitHub Actions y Sintaxis Cron

**Etiquetas:** #git #cloud #cicd #automatizacion

## El Disparador
En la carpeta `.github/workflows/`, el archivo `actualizador.yml` es el cerebro del orquestador.
El disparador (cuándo arranca el servidor en la nube) se define en el bloque `on:`:

```yaml
on:
  schedule:
    - cron: '0 */6 * * *'
  workflow_dispatch:
```

### Explicación del Cron
La sintaxis Cron `0 */6 * * *` se lee de izquierda a derecha:
1. `0`: Minuto cero de la hora.
2. `*/6`: Cada 6 horas.
3. `*`: Cualquier día del mes.
4. `*`: Cualquier mes.
5. `*`: Cualquier día de la semana.
Esto garantiza que TalentUP sea pasivo (coste cero) hasta que den las 00:00, 06:00, 12:00 y 18:00, momento en el que se enciende.

### Workflow Dispatch
El `workflow_dispatch` permite que aparezca un botón físico en la interfaz web de GitHub ("Run workflow"). Imprescindible para pruebas técnicas manuales, ya que nos salvó la vida cuando tuvimos que probar que el parche de `feedparser` funcionaba.
