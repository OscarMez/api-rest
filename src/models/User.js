const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase()); // Guarda el email en minúsculas
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [8, 100], // Mínimo 8 caracteres
      isStrongPassword(value) {
        if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value) || !/[^A-Za-z0-9]/.test(value)) {
          throw new Error('La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.');
        }
      }
    }
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'USER'),
    defaultValue: 'USER'
  }
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) { // Solo en caso de que la contraseña cambie
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Método para comparar la contraseña con la almacenada en la base de datos
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = User;
