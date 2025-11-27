const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria'); // Importamos el modelo padre

const Subcategoria = sequelize.define('subcategorias', {
    id_subcategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // La clave foránea se define aquí, pero la relación real se hace en el paso 4
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria, // Referencia al modelo Categoria
            key: 'id_categoria', // La clave primaria del modelo padre
        }
    },
    nombre_subcategoria: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
     createdAt: {
        type: DataTypes.DATE,
        field: 'fecha_creacion',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: false
});

module.exports = Subcategoria;