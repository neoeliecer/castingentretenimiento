# Fundación Casting Entretenimiento - WordPress Automation System

Este repositorio contiene los scripts de automatización para estructurar, maquetar y desplegar el portal institucional de la **Fundación Casting Entretenimiento** en su entorno de WordPress (Pantheon).

## 🚀 Estructura de Páginas Automatizadas

El sistema genera dinámicamente y con diseños Gutenberg avanzados y adaptables las siguientes páginas:
1. **Inicio (`/`)**: Página de entrada principal con un carrusel interactivo de presentación (desvanecimiento suave de fotos), textos de bienvenida y tarjetas de acceso rápido. Configurada automáticamente como la página frontal estática del sitio.
2. **Quiénes Somos (`/quienes-somos`)**: Presentación institucional, historia, pilares de impacto y cifras de participación comunitaria en Cali y Colombia.
3. **Misión y Visión (`/mision-vision`)**: Doble columna con el propósito estratégico, Misión y Visión actualizadas de la fundación y un llamado a la acción.
4. **Documentos Legales (`/documentos-legales`)**: Espacio de transparencia corporativa con tarjetas responsivas preparadas para enlazar tus documentos (Estatutos, RUT, Cámara de Comercio).

---

## 🛠️ Cómo Utilizar los Scripts de Automatización

### 1. Requisitos
* Tener instalado **Node.js** (versión 20 o superior).
* Configurar las credenciales en un archivo local llamado `.env` (este archivo está excluido del control de versiones en `.gitignore` por seguridad).

### 2. Configurar el archivo `.env`
Crea un archivo llamado `.env` en la raíz del proyecto con la siguiente estructura:
```env
WP_URL=https://dev-castingentretenimiento.pantheonsite.io
WP_USER=tu_usuario_wordpress
WP_PASSWORD=tu_clave_de_aplicacion
```
*(Recuerda que la clave de aplicación se genera desde tu perfil en WordPress > Contraseñas de aplicación)*

### 3. Ejecutar los Scripts

#### A. Subir el Logotipo Institucional
Coloca el logotipo con el nombre de archivo `logo.jpg` en la raíz de esta carpeta y ejecuta:
```bash
node upload_logo.js
```
*Este script subirá la imagen directamente a la Biblioteca de Medios de WordPress.*

#### B. Publicar las Páginas Institucionales
Para crear o restablecer las páginas de Misión y Visión, Quiénes Somos y Documentos Legales con sus diseños premium, ejecuta:
```bash
node create_pages.js
```

#### C. Cargar fotos al Carrusel de Inicio
1. Coloca las imágenes que deseas mostrar en el carrusel dentro de la carpeta `fotos de carrrusel/` (formatos soportados: `.jpg`, `.jpeg`, `.png`).
2. Ejecuta:
```bash
node create_homepage.js
```
*El script detectará las fotos, las subirá a la Biblioteca de Medios y actualizará el carrusel de Inicio automáticamente con tus imágenes reales. Si la carpeta está vacía, se utilizarán hermosas imágenes artísticas preestablecidas.*

---

## 🔒 Seguridad y Buenas Prácticas
* **Claves seguras**: Nunca subas el archivo `.env` a GitHub. Está protegido mediante `.gitignore`.
* **Diseño Nativo**: Toda la maquetación se realiza sobre el editor nativo de bloques Gutenberg, lo que garantiza tiempos de carga ultrarrápidos y compatibilidad a largo plazo con el tema **Twenty Twenty-Five**.
