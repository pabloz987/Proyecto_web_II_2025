var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); // Carga las variables del .env

// 1. IMPORTAR TUS MODELOS (Base de Datos)
const db = require('./models');

// 2. IMPORTAR TUS RUTAS (Separadas por entidad)
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var categoriasRouter = require('./routes/categorias');
var subcategoriasRouter = require('./routes/subcategorias');
var nivelesRouter = require('./routes/niveles');
var rangosRouter = require('./routes/rangos');

var app = express();

// --- CONFIGURACIÓN DE EXPRESS ---

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); 

app.use(logger('dev'));
app.use(express.json()); // Middleware CLAVE para leer JSON
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// --- DEFINICIÓN DE ENDPOINTS (RUTAS API) ---

// Rutas base (web y usuarios básicos)
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Rutas de la API (Aquí conectamos los archivos nuevos)
// Nota: La ruta que definas aquí se suma a la definida en el archivo.
// Ej: '/api/categorias' + '/' = localhost:3000/api/categorias

app.use('/api/categorias', categoriasRouter);
app.use('/api/subcategorias', subcategoriasRouter);
app.use('/api/niveles_dificultad', nivelesRouter);
app.use('/api/rangos_edad', rangosRouter);


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
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza página de error si es petición web, o JSON si es API
  // Como prefieres API, forzamos respuesta JSON si hay error
  res.status(err.status || 500);
  res.json({
    status: err.status || 500,
    message: err.message,
    stack: req.app.get('env') === 'development' ? err.stack : undefined 
  });
});

module.exports = app;