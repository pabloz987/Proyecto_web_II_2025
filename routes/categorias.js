var express = require('express');
var router = express.Router();
const db = require('../models');

// POST: Crear categoría
router.post('/', async (req, res) => {
    try {
        // 1. Extraemos el campo exacto que envías en el JSON
        const { nombre_categoria } = req.body; 

        // Verificamos por consola qué estamos recibiendo (para depurar)
        console.log("Intentando registrar:", nombre_categoria);

        // 2. Buscamos si ya existe en la Base de Datos
        // IMPORTANTE: Aquí asumo que tu columna en la base de datos TAMBIÉN se llama 'nombre_categoria'
        // Si en la base de datos se llama 'nombre' o 'descripcion', cambia la parte izquierda del where.
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
        // Imprimimos el error real en la consola negra para que sepas qué pasó
        console.error("❌ Error al crear la categoría:", error);
        
        // Devolvemos el mensaje de error técnico al Postman para que lo leas
        res.status(400).json({ 
            error: 'Error al crear la categoría.',
            detalle_tecnico: error.message // Esto te dirá si la columna no existe o si es otro error
        });
    }
});

module.exports = router;