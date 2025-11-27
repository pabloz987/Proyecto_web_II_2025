const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const NivelDificultad = sequelize.define('niveles_dificultad', {
    id_dificultad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nivel: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true, // Es buena práctica dar un valor por defecto
    },
}, {
    // Opciones adicionales del modelo
    timestamps: false // Tu diagrama no tiene fechas para esta tabla específica
});

module.exports = NivelDificultad;