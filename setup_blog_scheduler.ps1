# =========================================================================
# CONFIGURADOR DE TAREAS PROGRAMADAS EN WINDOWS (Task Scheduler via schtasks CMD wrapper)
# =========================================================================

$workingDir = "c:\Users\neo\Documents\agente\casting entretenimiento"

Write-Host "Registrando tareas programadas mediante schtasks.exe (CMD wrapper)..." -ForegroundColor Cyan
Write-Host "Directorio de trabajo: $workingDir"
Write-Host ""

# ---------------------------------------------------------
# TAREA 1: AUTO BLOGGER DIARIO (Noticias de Cine y Teatro)
# ---------------------------------------------------------
$taskNameBlog = "CastingEntretenimientoBlog"
$scriptPathBlog = "$workingDir\auto_blogger.js"

Write-Host "Registrando: $taskNameBlog" -ForegroundColor Yellow
# Usamos cmd.exe /c para asegurar el escape de las comillas dobles en la ruta con espacios
cmd.exe /c "schtasks /create /tn `"$taskNameBlog`" /tr `"node \`"$scriptPathBlog\`"`" /sc daily /st 08:00 /f"

Write-Host "---------------------------------------------------------"

# ---------------------------------------------------------
# TAREA 2: AUTO CONVOCATORIAS DIARIAS (Castings y Audiciones)
# ---------------------------------------------------------
$taskNameConvocatorias = "CastingEntretenimientoConvocatorias"
$scriptPathConvocatorias = "$workingDir\auto_convocatorias.js"

Write-Host "Registrando: $taskNameConvocatorias" -ForegroundColor Yellow
# Usamos cmd.exe /c para asegurar el escape de las comillas dobles en la ruta con espacios
cmd.exe /c "schtasks /create /tn `"$taskNameConvocatorias`" /tr `"node \`"$scriptPathConvocatorias\`"`" /sc daily /st 08:30 /f"

Write-Host ""
Write-Host "========================================================="
Write-Host "AUTOMATIZACION CONFIGURADA COMPLETAMENTE!" -ForegroundColor Green
Write-Host "Ambos scripts se ejecutaran en segundo plano de forma silenciosa." -ForegroundColor Yellow
Write-Host "Puedes ver los archivos de registro locales en:" -ForegroundColor White
Write-Host "-> $workingDir\scratch\auto_blogger.log" -ForegroundColor Cyan
Write-Host "-> $workingDir\scratch\auto_convocatorias.log" -ForegroundColor Cyan
Write-Host "========================================================="
