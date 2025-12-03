var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config(); 
var bcrypt = require('bcryptjs'); 

// 1. IMPORTAR MODELOS
const db = require('./models');

// 2. IMPORTAR RUTAS
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
app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// --- DEFINICIÓN DE ENDPOINTS ---

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/subcategorias', subcategoriasRouter);
app.use('/api/niveles_dificultad', nivelesRouter);
app.use('/api/rangos_edad', rangosRouter);


// --- ARRANQUE DE LA BASE DE DATOS Y SEEDER ---

db.sequelize.sync({ force: false })
    .then(async () => {
        console.log("✅ Base de datos sincronizada correctamente");

        // --- DIAGNÓSTICO DE MODELOS (IMPORTANTE) ---
        // Esto imprimirá qué modelos existen realmente en 'db'
        console.log("🔍 Modelos cargados en DB:", Object.keys(db));

        // Verificamos si db.User existe antes de usarlo
        if (!db.User) {
            console.error("❌ ERROR FATAL: El modelo 'User' no se cargó. Revisa que el archivo en /models se llame User.js y tenga module.exports correcto.");
            return; // Detenemos aquí para no crashear
        }

        try {
            const adminExistente = await db.User.findOne({ 
                where: { email: 'admin@admin.com' } 
            });

            if (!adminExistente) {
                console.log("⚠️ Creando Administrador por defecto...");
                
                const passwordHash = bcrypt.hashSync('admin123', 8);

                await db.User.create({
                    nombre: 'Super Administrador',
                    email: 'admin@admin.com',
                    password: passwordHash,
                    rol: 'admin'
                });

                console.log("🚀 Usuario Admin creado con éxito.");
                console.log("📧 Email: admin@admin.com");
                console.log("🔑 Pass: admin123");
            } else {
                console.log("ℹ️ El admin ya existe.");
            }
            
        } catch (error) {
            console.error("❌ Error al intentar crear el usuario admin:", error);
        }
    })
    .catch((err) => {
        console.error("❌ Error al sincronizar la DB:", err);
    });


// --- MANEJADORES DE ERRORES ---

app.use(function(req, res, next) {
  res.status(404).json({ status: 404, message: "Ruta no encontrada." }); 
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ status: err.status || 500, message: err.message });
});

module.exports = app;