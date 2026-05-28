@echo off
set "workingDir=c:\Users\neo\Documents\agente\casting entretenimiento"

echo Re-programando tareas en schtasks.exe (Lunes y Viernes)...
echo Directorio de trabajo: %workingDir%
echo.

:: Registrar Tarea 1: Blog (Lunes y Viernes a las 09:00 AM)
echo Registrando: CastingEntretenimientoBlog...
schtasks /create /tn "CastingEntretenimientoBlog" /tr "node \"%workingDir%\auto_blogger.js\"" /sc weekly /d MON,FRI /st 09:00 /f

echo ---------------------------------------------------------

:: Registrar Tarea 2: Convocatorias (Lunes y Viernes a las 09:30 AM)
echo Registrando: CastingEntretenimientoConvocatorias...
schtasks /create /tn "CastingEntretenimientoConvocatorias" /tr "node \"%workingDir%\auto_convocatorias.js\"" /sc weekly /d MON,FRI /st 09:30 /f

echo.
echo =========================================================
echo PROGRAMACION RE-CONFIGURADA EXITOSAMENTE EN WINDOWS!
echo Ambos scripts se ejecutaran los lunes y viernes en segundo plano:
echo - Blog: Lunes y Viernes a las 09:00 AM
echo - Convocatorias: Lunes y Viernes a las 09:30 AM
echo =========================================================
