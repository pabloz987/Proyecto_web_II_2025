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

module.exports = router;