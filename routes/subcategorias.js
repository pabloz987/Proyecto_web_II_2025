var express = require('express');
var router = express.Router();
const db = require('../models');

// --- CRUD SUBCATEGORIAS ---
// Ruta base en app.js: /api/subcategorias

// POST: Crear
router.post('/', async (req, res) => {
    try {
        // Asegúrate de que el cuerpo JSON incluye el id_categoria
        const nuevaSubcategoria = await db.Subcategoria.create(req.body);
        res.status(201).json(nuevaSubcategoria);
    } catch (error) {
        console.error("Error al crear Subcategoria:", error);
        res.status(400).json({ error: 'Error al crear la subcategoría. Verifica el ID de Categoría.' });
    }
});

// GET: Listar todas
router.get('/', async (req, res) => {
    try {
        const subcategorias = await db.Subcategoria.findAll(); 
        res.status(200).json(subcategorias); 
    } catch (error) {
        console.error("Error al obtener subcategorías:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar subcategorías.' });
    }
});

// GET: Obtener una por ID
router.get('/:id', async (req, res) => {
    try {
        const idSubcategoria = req.params.id;
        const subcategoria = await db.Subcategoria.findByPk(idSubcategoria); 

        if (subcategoria) {
            res.status(200).json(subcategoria);
        } else {
            res.status(404).json({ message: `Subcategoría con ID ${idSubcategoria} no encontrada.` });
        }
    } catch (error) {
        console.error("Error al obtener la subcategoría:", error);
        res.status(500).json({ error: 'Error del servidor al buscar subcategoría.' });
    }
});

// PUT: Actualizar
router.put('/:id', async (req, res) => {
    try {
        const idSubcategoria = req.params.id;
        const [filasActualizadas] = await db.Subcategoria.update(req.body, {
            where: { id_subcategoria: idSubcategoria }
        });

        if (filasActualizadas > 0) {
            res.status(200).json({ message: 'Subcategoría actualizada correctamente.' });
        } else {
            res.status(404).json({ message: `Subcategoría con ID ${idSubcategoria} no encontrada para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar la subcategoría:", error);
        res.status(400).json({ error: 'Error al actualizar la subcategoría. Datos inválidos o ID de Categoría incorrecto.' });
    }
});

// DELETE: Eliminar
router.delete('/:id', async (req, res) => {
    try {
        const idSubcategoria = req.params.id;
        const filasEliminadas = await db.Subcategoria.destroy({
            where: { id_subcategoria: idSubcategoria }
        });

        if (filasEliminadas > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: `Subcategoría con ID ${idSubcategoria} no encontrada para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar la subcategoría:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar subcategoría.' });
    }
});

module.exports = router;