const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Categoria = require('./Categoria'); 

const Subcategoria = sequelize.define('subcategorias', {
    id_subcategoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    // Clave Foránea
    id_categoria: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Categoria, 
            key: 'id_categoria', 
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
    // Campo de Creación
    createdAt: {
        type: DataTypes.DATE,
        field: 'fecha_creacion', // Mapeo al nombre de tu diagrama
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    // **¡IMPORTANTE!** Asegúrate de que no hay ninguna definición de columna para 'updatedAt' aquí.
}, {
    // OPCIONES DEL MODELO (FUERA DE LA DEFINICIÓN DE COLUMNAS)
    tableName: 'subcategorias',
    timestamps: true, // Esto le dice que use createdAt (y buscaría updatedAt)
    updatedAt: false // **¡ESTO LO DESACTIVA!** Evita que genere el campo `updated_at false`
});

module.exports = Subcategoria;