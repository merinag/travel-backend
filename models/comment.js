const { DataTypes } = require("sequelize");
const database = require("../database");

const Comment = database.define("comment", {
  firstName:DataTypes.STRING,
  lastName: DataTypes.STRING,
  message: DataTypes.STRING,
  username: DataTypes.STRING
},{
  timestamps:false
});
module.exports =Comment