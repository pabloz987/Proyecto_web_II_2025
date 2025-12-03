var express = require('express');
var router = express.Router();
const db = require('../models');

// --- CRUD CATEGORIAS ---
// Ruta base en app.js: /api/categorias

// POST: Crear categoría (Con validación de duplicados)
router.post('/', async (req, res) => {
    try {
        // 1. Extraemos el campo por el cual quieres verificar la duplicidad.
        // IMPORTANTE: Asegúrate de que 'nombre' sea el nombre real de tu columna en la BD.
        // Si tu columna se llama 'descripcion' o 'titulo', cámbialo aquí.
        const { nombre } = req.body; 

        // 2. Buscamos si ya existe una categoría con ese nombre
        const existe = await db.Categoria.findOne({ 
            where: { nombre: nombre } 
        });

        // 3. Si encontramos algo, devolvemos un mensaje y detenemos la ejecución
        if (existe) {
            // Usamos return para salir de la función y no intentar crearla
            // 409 Conflict es el código HTTP estándar para registros duplicados
            return res.status(409).json({ 
                message: 'Esa categoría ya existe.' 
            });
        }

        // 4. Si no existe, procedemos a crearla normalmente
        const nuevaCategoria = await db.Categoria.create(req.body);
        res.status(201).json(nuevaCategoria);

    } catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(400).json({ error: 'Error al crear la categoría. Datos inválidos.' });
    }
});

// ... (El resto de tus rutas GET, PUT, DELETE siguen igual) ...

// GET: Listar todas
router.get('/', async (req, res) => {
    try {
        const categorias = await db.Categoria.findAll(); 
        res.status(200).json(categorias); 
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar categorías.' });
    }
});

// GET: Obtener una por ID
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

// PUT: Actualizar
router.put('/:id', async (req, res) => {
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

// DELETE: Eliminar
router.delete('/:id', async (req, res) => {
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