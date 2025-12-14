📘 API Backend - Sistema de Gestión de Cuestionarios

Cuenta con características avanzadas como:
🔒 Seguridad HTTPS/TLS con certificados autofirmados.
🚀 Protocolo HTTP/2 para alta velocidad (usando spdy).
🛡️ Autenticación JWT y Control de Acceso Basado en Roles (RBAC).
🗄️ ORM Sequelize para manejo de base de datos MySQL.

📋 1. Requisitos Previos
Antes de comenzar, asegúrate de tener instalado lo siguiente en tu computadora:
Node.js (Versión 14 o superior): https://nodejs.org/es
MySQL Server: Workbench.
Git (Para clonar el repositorio).
OpenSSL (Generalmente viene con Git Bash en Windows, o nativo en Linux/Mac) para generar certificados.
🛠️ 2. Instalación del Proyecto
Clonar el repositorio: Abre tu terminal y ejecuta:
Bash
git clone https://github.com/pabloz987/Proyecto_web_II_2025.git
cd nombre-de-tu-carpeta
Instalar dependencias: Descarga todas las librerías necesarias (express, sequelize, mysql2, jsonwebtoken, bcryptjs, spdy, etc.):
Bash
npm install
⚙️ 3. Configuración del Entorno (.env)
El proyecto no incluye el archivo de variables de entorno por seguridad. Debes crearlo tú mismo.
Crea un archivo llamado .env, puedes usar como ejemplo el .env.example en la raíz del proyecto.
Copia y pega el siguiente contenido, ajustando los valores a tu configuración local de MySQL:
Properties
# --- Configuración del Servidor ---
PORT=3000

# --- Base de Datos MySQL ---

DB_NAME=cuestionarios_db
DB_USER= #Tu nombre del usuario de la base de datos
DB_PASSWORD= #Tu Contrase;a de MySQL
DB_HOST=localhost
DB_PORT=3306

# --- Seguridad (JWT) ---
JWT_SECRET=mi_clave_secreta_super_segura_cambiame
🔐 4. Generación de Certificados SSL (HTTPS/HTTP2)
Como el servidor usa HTTP/2, es obligatorio tener certificados SSL. Generaremos unos certificados autofirmados para desarrollo local.
Abre una terminal en la raíz del proyecto (en Windows usa Git Bash).
Ejecuta el siguiente comando:
Bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert
(Puedes presionar Enter a todas las preguntas que te haga el sistema).

✅ Esto creará dos archivos: server.key y server.cert en la carpeta raíz. Sin estos archivos, el servidor no arrancará.

🗄️ 5. Base de Datos
Abre tu cliente SQL en este caso Workbench.
Crea una base de datos vacía con el mismo nombre que pusiste en el archivo .env:
SQL
CREATE DATABASE cuestionarios_db;
Nota: No es necesario crear las tablas. Sequelize las creará automáticamente al iniciar la aplicación.

🚀 6. Ejecutar el Proyecto
Una vez configurado todo, levanta el servidor:

Bash
npm start
Si todo salió bien, verás en la consola:
🔒 Servidor HTTP/2 seguro corriendo en https://localhost:3000
✅ Base de datos sincronizada correctamente
🚀 Usuario Admin creado con éxito (Solo la primera vez).
🧪 7. Primeros Pasos y Pruebas
Usuario Administrador por Defecto
El sistema crea automáticamente un superusuario la primera vez que se ejecuta. Úsalo para iniciar sesión y crear otros usuarios.
Email: admin@admin.com
Password: admin123
Cómo probar en Postman (Importante)
Dado que usamos certificados autofirmados:
Ve a Settings (Configuración) en Postman.
Desactiva la opción "SSL certificate verification".
Usa siempre https:// en tus URLs.
Ejemplo de Login:
Método: POST
URL: https://localhost:3000/users/login
Body (JSON):
JSON
{
  "email": "admin@admin.com",
  "password": "admin123"
}
Copia el token de la respuesta para usarlo en las demás peticiones (Header: Authorization: Bearer <token>).
📂 Estructura del Proyecto
/bin/www: Punto de entrada del servidor (Configuración HTTPS/SPDY).
/models: Definición de tablas (Sequelize).
/routes: Endpoints de la API.
/middleware: Lógica de protección de rutas (Auth JWT).
/config: Configuración de conexión a BD.