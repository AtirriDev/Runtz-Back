# Runtz-Back

Backend API E-commerce.  
Repositorio que contiene el código fuente del backend (API) para Runtz, la tienda online de indumentaria, calzado y accesorios de estilo urbano y básquet.  
Desarrollado con Node.js y utilizando el framework Express para gestionar las operaciones y datos de la plataforma.

## Repositorios relacionados

- [Runtz-Front]((https://github.com/AtirriDev/Runtz-Front)) - Repositorio con el frontend de la aplicación, desarrollado en HTML, Tailwind y JavaScript vanilla.

## Instalación

Clonar el repositorio:

git clone https://github.com/AtirriDev/Runtz-Back.git  
cd Runtz-Back

Instalar las dependencias:

npm install

Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las variables necesarias. Por ejemplo:

PORT=3000

## Uso

Para arrancar el servidor en modo desarrollo:

npm run dev

(si tenés configurado nodemon)

O para producción:

npm start

El servidor correrá en `http://localhost:3000` (o el puerto que configures).

## Estructura del proyecto

- /data : Archivos de datos json  
- /routes : Definición de rutas API  
- index.js : Punto de entrada del servidor  
- .env : Variables de entorno  
- .gitignore : Archivos y carpetas ignoradas en git  
- package.json y package-lock.json : Dependencias y scripts  

## Notas

- La carpeta node_modules no está incluida en el repositorio, para instalar las dependencias usar npm install.  
- Asegurarse de tener Node.js instalado (versión X o superior).




