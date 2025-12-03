var express = require('express');
var router = express.Router();
const db = require('../models');

// IMPORTANTE: Importamos los middlewares de seguridad
// Asegúrate de haber creado el archivo 'middleware/auth.js' como vimos en el paso anterior
const { verificarToken, esProfesor } = require('../middleware/auth');

// --- CRUD CATEGORIAS ---
// Ruta base en app.js: /api/categorias

// POST: Crear categoría (PROTEGIDO: Solo Profesores/Admin)
// Se revisa token y rol antes de entrar a la función
router.post('/', [verificarToken, esProfesor], async (req, res) => {
    try {
        // 1. Extraemos el campo exacto
        const { nombre_categoria } = req.body; 

        // 2. Buscamos duplicados
        const existe = await db.Categoria.findOne({ 
            where: { nombre_categoria: nombre_categoria } 
        });

        if (existe) {
            return res.status(409).json({ 
                message: 'Esa categoría ya existe.' 
            });
        }

        // 3. Crear la categoría
        const nuevaCategoria = await db.Categoria.create(req.body);
        res.status(201).json(nuevaCategoria);

    } catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(400).json({ 
            error: 'Error al crear la categoría. Datos inválidos.',
            detalle: error.message 
        });
    }
});

// GET: Listar todas (PÚBLICO)
// Nota: No tiene middleware para que la app pueda cargar la lista para alumnos
router.get('/', async (req, res) => {
    try {
        const categorias = await db.Categoria.findAll(); 
        res.status(200).json(categorias); 
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar categorías.' });
    }
});

// GET: Obtener una por ID (PÚBLICO)
router.get('/:id', async (req, res) => {
    try {
        const idCategoria = req.params.id;
        const categoria = await db.Categoria.findByPk(idCategoria); 

        if (categoria) {
            res.status(200).json(categoria);
        } else {
            res.status(404).json({ message: `Categoría con ID ${idCategoria} no encontrada.` });
        }
    } catch (error) {
        console.error("Error al obtener la categoría:", error);
        res.status(500).json({ error: 'Error del servidor al buscar categoría.' });
    }
});

// PUT: Actualizar (PROTEGIDO: Solo Profesores/Admin)
router.put('/:id', [verificarToken, esProfesor], async (req, res) => {
    try {
        const idCategoria = req.params.id;
        const [filasActualizadas] = await db.Categoria.update(req.body, {
            where: { id_categoria: idCategoria }
        });

        if (filasActualizadas > 0) {
            res.status(200).json({ message: 'Categoría actualizada correctamente.' }); 
        } else {
            res.status(404).json({ message: `Categoría con ID ${idCategoria} no encontrada para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(400).json({ error: 'Error al actualizar la categoría. Datos inválidos.' });
    }
});

// DELETE: Eliminar (PROTEGIDO: Solo Profesores/Admin)
router.delete('/:id', [verificarToken, esProfesor], async (req, res) => {
    try {
        const idCategoria = req.params.id;
        const filasEliminadas = await db.Categoria.destroy({
            where: { id_categoria: idCategoria }
        });

        if (filasEliminadas > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: `Categoría con ID ${idCategoria} no encontrada para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar categoría.' });
    }
});

module.exports = router;