module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    nombre: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING, // Aquí guardaremos el hash encriptado
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING, 
        defaultValue: 'profesor' // Por defecto 'profesor', o 'admin'
    }
  });
  return Usuario;
};