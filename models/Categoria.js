const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Categoria = sequelize.define('categorias', {
    id_categoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_categoria: {
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
    // Este campo es tu 'fecha_creacion'.
    // Sequelize lo maneja internamente si se llama 'createdAt', 
    // pero le decimos que el nombre en la DB es 'fecha_creacion'
    createdAt: { 
        type: DataTypes.DATE,
        field: 'fecha_creacion', // <--- Mapeo al nombre de tu diagrama
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false // Ya que tu diagrama lo tiene como timestamp(6)
    },
    // ELIMINAMOS EL CAMPO UPDATED AT DE LA DEFINICIÓN DE COLUMNAS AQUÍ
    
}, {
    // OPCIONES DEL MODELO (FUERA DE LA DEFINICIÓN DE COLUMNAS)
    tableName: 'categorias',
    timestamps: true, // Lo ponemos en true para que use createdAt, pero...
    updatedAt: false // ...lo ponemos en false aquí para que no intente crear un updated_at
    // El error anterior fue intentar definir updatedAt como una columna cuando es una OPCIÓN
});

module.exports = Categoria;