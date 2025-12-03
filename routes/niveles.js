var express = require('express');
var router = express.Router();
const db = require('../models');

// --- CRUD NIVELES DIFICULTAD ---
// Ruta base en app.js: /api/niveles_dificultad

// POST: Crear
router.post('/', async (req, res) => {
    try {
        const nuevoNivel = await db.NivelDificultad.create(req.body);
        res.status(201).json(nuevoNivel);
    } catch (error) {
        console.error("Error al crear NivelDificultad:", error);
        res.status(400).json({ error: 'Error al crear el nivel de dificultad. Datos inválidos.' });
    }
});

// GET: Listar todos
router.get('/', async (req, res) => {
    try {
        const niveles = await db.NivelDificultad.findAll(); 
        res.status(200).json(niveles); 
    } catch (error) {
        console.error("Error al obtener niveles de dificultad:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar niveles de dificultad.' });
    }
});

// GET: Obtener uno por ID
router.get('/:id', async (req, res) => {
    try {
        const idNivel = req.params.id;
        const nivel = await db.NivelDificultad.findByPk(idNivel); 

        if (nivel) {
            res.status(200).json(nivel);
        } else {
            res.status(404).json({ message: `Nivel de dificultad con ID ${idNivel} no encontrado.` });
        }
    } catch (error) {
        console.error("Error al obtener el nivel de dificultad:", error);
        res.status(500).json({ error: 'Error del servidor al buscar nivel de dificultad.' });
    }
});

// PUT: Actualizar
router.put('/:id', async (req, res) => {
    try {
        const idNivel = req.params.id;
        const [filasActualizadas] = await db.NivelDificultad.update(req.body, {
            where: { id_dificultad: idNivel }
        });

        if (filasActualizadas > 0) {
            res.status(200).json({ message: 'Nivel de dificultad actualizado correctamente.' });
        } else {
            res.status(404).json({ message: `Nivel de dificultad con ID ${idNivel} no encontrado para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el nivel de dificultad:", error);
        res.status(400).json({ error: 'Error al actualizar el nivel de dificultad. Datos inválidos.' });
    }
});

// DELETE: Eliminar
router.delete('/:id', async (req, res) => {
    try {
        const idNivel = req.params.id;
        const filasEliminadas = await db.NivelDificultad.destroy({
            where: { id_dificultad: idNivel }
        });

        if (filasEliminadas > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: `Nivel de dificultad con ID ${idNivel} no encontrado para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar el nivel de dificultad:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar nivel de dificultad.' });
    }
});

module.exports = router;