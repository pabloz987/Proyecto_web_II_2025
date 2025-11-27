const sequelize = require('../config/database');

// Importar modelos
const NivelDificultad = require('./NivelDificultad');
const RangoEdad = require('./RangoEdad');
const Categoria = require('./Categoria');
const Subcategoria = require('./Subcategoria');

// --- DEFINICIÓN DE RELACIONES ---
// (Basado en las líneas de tu diagrama)

// Una Categoría tiene muchas Subcategorías
Categoria.hasMany(Subcategoria, { 
    foreignKey: 'id_categoria',
    as: 'subcategorias' // Alias para usar en consultas
});

// Una Subcategoría pertenece a una Categoría
Subcategoria.belongsTo(Categoria, { 
    foreignKey: 'id_categoria',
    as: 'categoria'
});


// --- OBJETO PRINCIPAL DB ---
const db = {
    sequelize,
    NivelDificultad,
    RangoEdad,
    Categoria,
    Subcategoria
    // Aquí añadirás los futuros modelos (Preguntas, etc.)
};

module.exports = db;