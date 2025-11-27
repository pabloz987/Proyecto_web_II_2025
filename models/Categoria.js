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
    // Sequelize crea automáticamente createdAt y updatedAt. 
    // Mapeamos createdAt a tu columna 'fecha_creacion'
    createdAt: {
        type: DataTypes.DATE,
        field: 'fecha_creacion', // Nombre real en la base de datos
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: false // Desactivamos updatedAt ya que no está en tu diagrama
});

module.exports = Categoria;