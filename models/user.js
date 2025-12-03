module.exports = (sequelize, DataTypes) => {
  // OJO: El primer parámetro es 'User' con mayúscula
  const User = sequelize.define('User', {
    nombre: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rol: {
        type: DataTypes.STRING, 
        defaultValue: 'profesor' 
    }
  }, {
    tableName: 'Users' // Forzamos el nombre de la tabla
  });
  
  return User;
};