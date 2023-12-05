const { DataTypes } = require("sequelize");
const database = require("../database");

const User = database.define("user", {

  name: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  username: DataTypes.STRING
}, {
  timestamps: false
});
module.exports = User