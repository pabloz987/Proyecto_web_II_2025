const jwt = require('jsonwebtoken');

// Clave secreta (MUEVELA AL ARCHIVO .ENV EN PRODUCCIÓN)
const SECRET_KEY = process.env.JWT_SECRET || "mi_clave_secreta_super_segura";

// 1. Verificar si el token es válido
const verificarToken = (req, res, next) => {
    const token = req.headers['authorization']; // Se espera formato: "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: 'Token requerido' });
    }

    try {
        // Quitamos la palabra "Bearer " si viene en el header
        const tokenLimpio = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;
        
        const decoded = jwt.verify(tokenLimpio, SECRET_KEY);
        req.user = decoded; // Guardamos los datos del usuario en la petición
        next(); // Dejamos pasar
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// 2. Verificar si es Administrador
const esAdmin = (req, res, next) => {
    // verificarToken ya se ejecutó antes, así que tenemos req.user
    if (req.user.rol === 'admin') {
        next(); // Es admin, pase
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Administrador.' });
    }
};

// 3. Verificar si es Profesor (o Admin, ya que el admin suele tener permiso total)
const esProfesor = (req, res, next) => {
    if (req.user.rol === 'profesor' || req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de Profesor.' });
    }
};

module.exports = { verificarToken, esAdmin, esProfesor, SECRET_KEY };