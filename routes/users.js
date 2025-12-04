// routes/users.js
var express = require('express');
var router = express.Router();
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verificarToken, esAdmin, SECRET_KEY } = require('../middleware/auth');

// --- LOGIN (PÚBLICO) ---
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // CORRECCIÓN AQUÍ: Usamos db.User en lugar de db.Usuario
        const usuario = await db.User.findOne({ where: { email } });
        
        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const passwordValido = bcrypt.compareSync(password, usuario.password);
        if (!passwordValido) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            SECRET_KEY, 
            { expiresIn: '8h' }
        );

        res.json({ token, rol: usuario.rol });

    } catch (error) {
        console.error(error); // Para ver errores en consola
        res.status(500).json({ error: error.message });
    }
});

// --- REGISTRAR NUEVO USUARIO (SOLO ADMIN) ---
router.post('/register', [verificarToken, esAdmin], async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);

        // CORRECCIÓN AQUÍ: Usamos db.User
        const nuevoUsuario = await db.User.create({
            nombre,
            email,
            password: hashedPassword,
            rol: rol 
        });

        res.status(201).json({ message: "Usuario creado con éxito", usuario: nuevoUsuario.email });

    } catch (error) {
        res.status(400).json({ error: "Error al crear usuario. El email podría estar duplicado." });
    }
});


// --- OBTENER TODOS LOS USUARIOS (SOLO ADMIN) ---
router.get('/', [verificarToken, esAdmin], async (req, res) => {
    try {
        // Buscamos todos los usuarios, excluyendo el campo 'password'
        const usuarios = await db.User.findAll({
            attributes: { exclude: ['password'] }
        });
        
        res.status(200).json(usuarios);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener usuarios", details: error.message });
    }
});

// --- OBTENER UN USUARIO POR ID (SOLO ADMIN) ---
router.get('/:id', [verificarToken, esAdmin], async (req, res) => {
    try {
        const { id } = req.params;

        // Buscamos el usuario por su ID, excluyendo el campo 'password'
        const usuario = await db.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.status(200).json(usuario);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el usuario", details: error.message });
    }
});

// --- ACTUALIZAR UN USUARIO POR ID (SOLO ADMIN) ---
router.put('/:id', [verificarToken, esAdmin], async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, password, rol } = req.body;
        
        // Buscamos el usuario
        const usuario = await db.User.findByPk(id);

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        let updateData = { nombre, email, rol };

        // Si se proporciona una nueva contraseña, la hasheamos
        if (password) {
            updateData.password = bcrypt.hashSync(password, 8);
        }
        
        // Actualizamos el usuario
        const [updatedRows] = await db.User.update(updateData, {
            where: { id: id }
        });

        if (updatedRows === 0) {
            return res.status(400).json({ message: "No se pudo actualizar el usuario (posiblemente datos idénticos)" });
        }

        // Recuperar el usuario actualizado para la respuesta, excluyendo la contraseña
        const usuarioActualizado = await db.User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        
        res.status(200).json({ message: "Usuario actualizado con éxito", usuario: usuarioActualizado });

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Error al actualizar el usuario", details: error.message });
    }
});

// --- ELIMINAR UN USUARIO POR ID (SOLO ADMIN) ---
router.delete('/:id', [verificarToken, esAdmin], async (req, res) => {
    try {
        const { id } = req.params;

        // Eliminamos el usuario
        const deletedRows = await db.User.destroy({
            where: { id: id }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: "Usuario no encontrado o ya eliminado" });
        }

        res.status(200).json({ message: "Usuario eliminado con éxito" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el usuario", details: error.message });
    }
});



module.exports = router;