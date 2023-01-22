'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull : false,
      unique: true
    },
    firstName: {
      type:DataTypes.STRING,
      allowNull : false,
    },
    lastName: {
      type:DataTypes.STRING,
      allowNull : false,
    },
    password: {
      type:DataTypes.STRING,
      allowNull : false,
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook ('beforeCreate', async (user, options) => {

    if(user.email){
      user.email = user.email.toLowerCase();
    }

    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
  }



  return User;
};
