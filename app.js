var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); // Carga las variables del .env

// 1. IMPORTAR TUS MODELOS (Base de Datos)
const db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// --- CONFIGURACIÓN DE EXPRESS ---

// Esta sección de vistas ya no es necesaria si solo haces API,
// pero la dejamos por si Express Generator la requiere en alguna ruta
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); 

app.use(logger('dev'));
app.use(express.json()); // Middleware CLAVE para leer JSON en peticiones POST/PUT
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// --- DEFINICIÓN DE ENDPOINTS (RUTAS API) ---

// ----------------------------------------------------
// CRUD PARA LA ENTIDAD: CATEGORIAS
// ----------------------------------------------------


// RUTA POST /api/categorias (Crear una nueva categoría)
app.post('/api/categorias', async (req, res) => {
    try {
        const nuevaCategoria = await db.Categoria.create(req.body);
        res.status(201).json(nuevaCategoria);
    } catch (error) {
        console.error("Error al crear la categoría:", error);
        res.status(400).json({ error: 'Error al crear la categoría. Datos inválidos.' });
    }
});

// --- POST para NIVELES_DIFICULTAD ---
app.post('/api/niveles_dificultad', async (req, res) => {
    try {
        const nuevoNivel = await db.NivelDificultad.create(req.body);
        res.status(201).json(nuevoNivel);
    } catch (error) {
        console.error("Error al crear NivelDificultad:", error);
        res.status(400).json({ error: 'Error al crear el nivel de dificultad. Datos inválidos.' });
    }
});

// --- POST para RANGOS_EDAD ---
app.post('/api/rangos_edad', async (req, res) => {
    try {
        const nuevoRango = await db.RangoEdad.create(req.body);
        res.status(201).json(nuevoRango);
    } catch (error) {
        console.error("Error al crear RangoEdad:", error);
        res.status(400).json({ error: 'Error al crear el rango de edad. Datos inválidos.' });
    }
});

// --- POST para SUBCATEGORIAS ---
app.post('/api/subcategorias', async (req, res) => {
    try {
        // Asegúrate de que el cuerpo JSON incluye el id_categoria
        const nuevaSubcategoria = await db.Subcategoria.create(req.body);
        res.status(201).json(nuevaSubcategoria);
    } catch (error) {
        console.error("Error al crear Subcategoria:", error);
        // El error 400 también atrapará fallos de clave foránea (id_categoria inexistente)
        res.status(400).json({ error: 'Error al crear la subcategoría. Verifica el ID de Categoría.' });
    }
});

// --- GET /api/subcategorias (Listar todas) ---
app.get('/api/categorias', async (req, res) => {
    try {
        const subcategorias = await db.Subcategoria.findAll(); 
        res.status(200).json(subcategorias); 
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar categorías.' });
    }
});

// RUTA GET /api/categorias/:id (Obtener una específica)
app.get('/api/categorias/:id', async (req, res) => {
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


// --- GET /api/subcategorias (Listar todas) ---
app.get('/api/subcategorias', async (req, res) => {
    try {
        const subcategorias = await db.Subcategoria.findAll(); 
        res.status(200).json(subcategorias); 
    } catch (error) {
        console.error("Error al obtener subcategorías:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar subcategorías.' });
    }
});

// --- GET /api/subcategorias/:id (Obtener una específica) ---
app.get('/api/subcategorias/:id', async (req, res) => {
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

// --- GET /api/niveles_dificultad (Listar todos) ---
app.get('/api/niveles_dificultad', async (req, res) => {
    try {
        const niveles = await db.NivelDificultad.findAll(); 
        res.status(200).json(niveles); 
    } catch (error) {
        console.error("Error al obtener niveles de dificultad:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar niveles de dificultad.' });
    }
});

// --- GET /api/niveles_dificultad/:id (Obtener uno específico) ---
app.get('/api/niveles_dificultad/:id', async (req, res) => {
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

// --- GET /api/rangos_edad (Listar todos) ---
app.get('/api/rangos_edad', async (req, res) => {
    try {
        const rangos = await db.RangoEdad.findAll(); 
        res.status(200).json(rangos); 
    } catch (error) {
        console.error("Error al obtener rangos de edad:", error);
        res.status(500).json({ error: 'Fallo interno al recuperar rangos de edad.' });
    }
});

// --- GET /api/rangos_edad/:id (Obtener uno específico) ---
app.get('/api/rangos_edad/:id', async (req, res) => {
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

// --- PUT /api/categorias/:id (Actualizar una categoría) ---
app.put('/api/categorias/:id', async (req, res) => {
    try {
        const idCategoria = req.params.id;
        // req.body contiene los datos a actualizar
        const [filasActualizadas, categoriasActualizadas] = await db.Categoria.update(req.body, {
            where: { id_categoria: idCategoria },
            returning: true // Necesario para MySQL para obtener los objetos actualizados (a veces solo devuelve el número)
        });

        if (filasActualizadas > 0) {
            // Devuelve el objeto actualizado si es posible, o un mensaje de éxito
            res.status(200).json({ message: 'Categoría actualizada correctamente.' }); 
        } else {
            res.status(404).json({ message: `Categoría con ID ${idCategoria} no encontrada para actualizar.` });
        }
    } catch (error) {
        console.error("Error al actualizar la categoría:", error);
        res.status(400).json({ error: 'Error al actualizar la categoría. Datos inválidos.' });
    }
});

// --- PUT /api/subcategorias/:id (Actualizar una subcategoría) ---
app.put('/api/subcategorias/:id', async (req, res) => {
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
        // Esto también puede ocurrir si el id_categoria en req.body no existe.
        res.status(400).json({ error: 'Error al actualizar la subcategoría. Datos inválidos o ID de Categoría incorrecto.' });
    }
});

// --- PUT /api/niveles_dificultad/:id (Actualizar un nivel) ---
app.put('/api/niveles_dificultad/:id', async (req, res) => {
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

// --- PUT /api/rangos_edad/:id (Actualizar un rango) ---
app.put('/api/rangos_edad/:id', async (req, res) => {
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
});// --- PUT /api/rangos_edad/:id (Actualizar un rango) ---
app.put('/api/rangos_edad/:id', async (req, res) => {
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

// RUTA DELETE /api/categorias/:id (Eliminar una categoría)
app.delete('/api/categorias/:id', async (req, res) => {
    try {
        const idCategoria = req.params.id;
        
        const filasEliminadas = await db.Categoria.destroy({
            where: { id_categoria: idCategoria }
        });

        if (filasEliminadas > 0) {
            // 204 No Content es el código estándar para DELETE exitoso
            res.status(204).send(); 
        } else {
            res.status(404).json({ message: `Categoría con ID ${idCategoria} no encontrada para eliminar.` });
        }
    } catch (error) {
        console.error("Error al eliminar la categoría:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar categoría.' });
    }
});

// --- DELETE /api/subcategorias/:id (Eliminar una subcategoría) ---
app.delete('/api/subcategorias/:id', async (req, res) => {
    try {
        const idSubcategoria = req.params.id;
        
        // Sequelize elimina el registro por su clave primaria
        const filasEliminadas = await db.Subcategoria.destroy({
            where: { id_subcategoria: idSubcategoria }
        });

        if (filasEliminadas > 0) {
            // Éxito: 204 No Content
            res.status(204).send(); 
        } else {
            // No se encontró el ID
            res.status(404).json({ message: `Subcategoría con ID ${idSubcategoria} no encontrada para eliminar.` });
        }
    } catch (error) {
        // Puede fallar por restricción de clave foránea si hay preguntas asociadas
        console.error("Error al eliminar la subcategoría:", error);
        res.status(500).json({ error: 'Error del servidor al eliminar subcategoría.' });
    }
});

// --- DELETE /api/niveles_dificultad/:id (Eliminar un nivel) ---
app.delete('/api/niveles_dificultad/:id', async (req, res) => {
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

// --- DELETE /api/rangos_edad/:id (Eliminar un rango) ---
app.delete('/api/rangos_edad/:id', async (req, res) => {
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

// --- RUTAS POR DEFECTO ---
app.use('/', indexRouter);
app.use('/users', usersRouter);

// --- ARRANQUE DE LA BASE DE DATOS (Sequelize) ---

db.sequelize.sync({ force: false }) 
    .then(() => {
        console.log("✅ Base de datos sincronizada correctamente");
    })
    .catch((err) => {
        console.error("❌ Error al sincronizar la DB:", err);
    });

// --- MANEJADORES DE ERRORES (Devuelven JSON) ---

// Manejador 404 (Not Found)
app.use(function(req, res, next) {
  res.status(404).json({ 
      status: 404, 
      message: "Ruta no encontrada (404). Verifica la URL." 
  }); 
});

// Manejador de errores general (500)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);

  res.json({
    status: err.status || 500,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined 
  });
});

// --- EXPORTAR LA APP (CRUCIAL PARA bin/www) ---
module.exports = app;