require('dotenv').config(); // Carga las variables del .env
const { Sequelize } = require('sequelize');

// Inicializamos la conexión a MySQL
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT,
        logging: false, // Ponlo en true si quieres ver las consultas SQL en consola
        define: {
            // Esto evita que Sequelize ponga nombres de tabla en plural automáticamente
            freezeTableName: true, 
            // Esto hace que los campos de tiempo sean 'created_at' y 'updated_at' en snake_case
            underscored: true, 
        }
    }
);

module.exports = sequelize;