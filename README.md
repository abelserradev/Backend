# Backend
Prueba tecnica backend
Descripción
API REST para una plataforma de compraventa de criptomonedas con autenticación JWT, operaciones CRUD para monedas fiduciarias y criptomonedas, y sistema de replicación histórica de datos.

Tecnologías
Node.js v18+

Express.js

PostgreSQL

Sequelize ORM

JWT (JSON Web Tokens)

Bcryptjs

Características Principales
Autenticación JWT

Gestión de monedas fiduciarias (CRUD)

Gestión de criptomonedas (CRUD)

Relación entre criptomonedas y monedas fiduciarias

Replicación histórica de datos

Protección de endpoints con JWT

Requisitos
Node.js v18+

PostgreSQL 12+

npm

Instalación
Clonar el repositorio:

bash
git clone https://github.com/abelserradev/Backend.git
cd tu-repositorio
Instalar dependencias:

bash
npm install
Configurar variables de entorno (crear archivo .env):

env
DB_HOST=localhost
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=crypto_db
DB_PORT=5432
JWT_SECRET=tu_clave_secreta_jwt
PORT=3000
Crear la base de datos en PostgreSQL:

bash
psql -U postgres -c "CREATE DATABASE crypto_db;"
Ejecutar migraciones:

bash
npx sequelize-cli db:migrate
Iniciar el servidor:

bash
npm start
Estructura de Directorios
src/
├── config/
│   └── database.js
├── controllers/
│   ├── authController.js
│   ├── currencyController.js
│   └── cryptoController.js
├── middlewares/
│   └── authMiddleware.js
├── models/
│   ├── index.js
│   ├── user.js
│   ├── currency.js
│   └── crypto.js
├── migrations/
├── routes/
│   ├── authRoutes.js
│   ├── currencyRoutes.js
│   └── cryptoRoutes.js
├── services/
│   └── historicalService.js
└── app.js
Endpoints de la API
Autenticación
POST /auth/register: Registrar nuevo usuario

POST /auth/login: Iniciar sesión y obtener token JWT

Monedas Fiduciarias
GET /moneda: Listar todas las monedas (requiere JWT)

POST /moneda: Crear nueva moneda (requiere JWT)

Criptomonedas
GET /criptomonedas: Listar todas las criptomonedas (requiere JWT)

POST /criptomonedas: Crear nueva criptomoneda (requiere JWT)

PUT /criptomonedas/:id: Actualizar criptomoneda (requiere JWT)

Sistema
GET localhost:3000

Ejemplos de Uso con cURL
1. Obtener token del sistema
bash
curl http://localhost:3000
2. Registrar usuario (usando token del sistema)
bash
curl -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer <SYSTEM_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"password123"}'
3. Login de usuario (usando token del sistema)
bash
curl -X POST http://localhost:3000/auth/login \
  -H "Authorization: Bearer <SYSTEM_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@ejemplo.com","password":"password123"}'
4. Crear moneda fiduciaria
bash
curl -X POST http://localhost:3000/moneda \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"code":"USD","name":"Dólar Estadounidense"}'
5. Crear criptomoneda
bash
curl -X POST http://localhost:3000/criptomonedas \
  -H "Authorization: Bearer <USER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bitcoin","symbol":"BTC"}'
