'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Comments.init({
    imageID : {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        isDate: true,
      }},
    userName: {
      type:DataTypes.STRING,
      allowNull:false,
    },
    comment:{
      type: DataTypes.STRING,
      trim: true,
      allowNull:false,
      validate:{
        min:1, max:128
      }
    } ,
    userID:{
      type: DataTypes.INTEGER,
      allowNull:false,
    }
  }, {
    sequelize,
    paranoid : true,
    modelName: 'Comments',
  });
  return Comments;
};

