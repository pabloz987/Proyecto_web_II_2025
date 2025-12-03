var express = require('express');
var router = express.Router();
const db = require('../models');

// --- CRUD RANGOS EDAD ---
// Ruta base en app.js: /api/rangos_edad

// POST: Crear
router.post('/', async (req, res) => {
    try {
        const nuevoRango = await db.RangoEdad.create(req.body);
        res.status(201).json(nuevoRango);
    } catch (error) {
        console.error("Error al crear RangoEdad:", error);
        res.status(400).json({ error: 'Error al crear el rango de edad. Datos inválidos.' });
    }
});

// GET: Listar todos
router.get('/', async (req, res) => {
    try {
        const rangos = await db.RangoEdad.findAll(); 
        res.status(200).json(rangos); 
    } catch (error) {
        console.error("Error al obtener rangos de edad:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar rangos de edad.' });
    }
});

// GET: Obtener uno por ID
router.get('/:id', async (req, res) => {
    try {
        const idRango = req.params.id;
        const rango = await db.RangoEdad.findByPk(idRango); 

        if (rango) {
            res.status(200).json(rango);
        } else {
            res.status(404).json({ message: `Rango de edad con ID ${idRango} no encontrado.` });
        }
    } catch (error) {
        console.error("Error al obtener el rango de edad:", error);
        res.status(500).json({ error: 'Error del servidor al buscar rango de edad.' });
    }
});

// PUT: Actualizar
router.put('/:id', async (req, res) => {
    try {
        const idRango = req.params.id;
        const [filasActualizadas] = await db.RangoEdad.update(req.body, {
            where: { id_rango_edad: idRango }
        });

        if (filasActualizadas > 0) {
            res.status(200).json({ message: 'Rango de edad actualizado correctamente.' });
        } else {
            res.status(404).json({ message: `Rango de edad con ID ${idRango} no encontrado para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar el rango de edad:", error);
        res.status(400).json({ error: 'Error al actualizar el rango de edad. Datos inválidos.' });
    }
});

// DELETE: Eliminar
router.delete('/:id', async (req, res) => {
    try {
        const idRango = req.params.id;
        const filasEliminadas = await db.RangoEdad.destroy({
            where: { id_rango_edad: idRango }
        });

        if (filasEliminadas > 0) {
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: `Rango de edad con ID ${idRango} no encontrado para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar el rango de edad:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar rango de edad.' });
    }
});

module.exports = router;