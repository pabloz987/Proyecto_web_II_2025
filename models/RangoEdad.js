const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RangoEdad = sequelize.define('rangos_edad', {
    id_rango_edad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_rango: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    edad_minima: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    edad_maxima: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    timestamps: false // Tu diagrama no tiene fechas para esta tabla
});

module.exports = RangoEdad;