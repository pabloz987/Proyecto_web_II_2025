const sequelize = require('../config/database');
const Sequelize = require('sequelize'); // Necesitamos esto para pasar los DataTypes

// 1. IMPORTAR MODELOS
// Nota: Si tus otros modelos (Categoria, etc.) ya funcionan, déjalos como están.
const NivelDificultad = require('./NivelDificultad');
const RangoEdad = require('./RangoEdad');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');

// --- IMPORTAR EL NUEVO MODELO USER ---
// Como User.js está escrito como una función (sequelize, DataTypes) => {...}
// debemos pasarle la conexión y los tipos de datos al importarlo:
const User = require('./User')(sequelize, Sequelize.DataTypes);


// --- DEFINICIÓN DE RELACIONES ---

// Una Categoría tiene muchas Subcategorías
Categoria.hasMany(Subcategoria, { 
    foreignKey: 'id_categoria',
    as: 'subcategorias' 
});

// Una Subcategoría pertenece a una Categoría
Subcategoria.belongsTo(Categoria, { 
    foreignKey: 'id_categoria',
    as: 'categoria'
});


// --- OBJETO PRINCIPAL DB ---
const db = {
    sequelize,
    Sequelize, // Es útil exportar la librería también
    NivelDificultad,
    RangoEdad,
    Categoria,
    Subcategoria,
    User // <--- ¡AQUÍ ESTÁ LA CLAVE! Ahora db.User existe.
};

module.exports = db;