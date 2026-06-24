# GIT: Permisos de Escritura del Bot (G_TOKEN)

**Etiquetas:** #git #cloud #seguridad

## El Problema del CI/CD 
Normalmente, una herramienta de Integración Continua (como GitHub Actions) se dedica a descargar el código, compilarlo y pasarle tests de errores. Su trabajo es de *lectura*.
Sin embargo, nuestro `rastreador.py` modificaba la base de datos y exigía que el bot subiera ese cambio de vuelta a nuestro repositorio (*escritura*).

## Solución de Permisos
```yaml
permissions:
  contents: write
```
Si no poníamos estas dos líneas mágicas en el `actualizador.yml`, al llegar al final del script y ejecutar `git push`, GitHub habría denegado el acceso al bot con un error 403 (Forbidden), evitando que nuestra web se actualizase.

## Configuración del Autor
Para que el log de commits estuviera limpio y Jordi supiese qué había hecho él a mano y qué había hecho la máquina de noche, configuramos la identidad del bot antes del push:
```bash
git config --global user.name "Robot TalentUP"
git config --global user.email "bot@talentup.com"
```
