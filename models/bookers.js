const { DataTypes } = require("sequelize");
const database = require("../database");
const { Bookings } = require("./booking");
const User = require("./user");

const Booker = database.define("booker", {
  date: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,

  guest: DataTypes.STRING
  // bookingId:DataTypes.NUMBER,
  // userId:DataTypes.NUMBER
});

Booker.belongsTo(User, { as: "user", foreignKey: "userId" });
Booker.belongsTo(Bookings, { as: "booking", foreignKey: "bookingId" });

module.exports = Booker;
