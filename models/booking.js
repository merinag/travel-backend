const { DataTypes } = require("sequelize");
const database = require("../database");

const Bookings = database.define(
  "booking",
  {
    img: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.FLOAT,
  },
  {
    timestamps: false,
  }
);

const defaultBooking = [

  {
    img: "spaafar.jpg",
    title: "AFAR",
    description: "kayling makes takes thrill to the next level.",
    price: 300.0,
  },
  {
    img: "spabrd.jpg",
    title: "SIMIEN",
    description: "kayling makes takes thrill to the next level.",
    price: 300.0,
  },
  {
    img: "semen.jpg",
    title: "BONGA",
    description: "kayling makes takes thrill to the next level.",
    price: 300.0,
  },
  {
    img: "coffe.jpg",
    title: "BAHIRDAR",
    description: "kayling makes takes thrill to the next level.",
    price: 300.0,
  },
];
const addDefaultBooking = () => {
  Bookings.bulkCreate(defaultBooking)
  // .then(() => {
  //   console.log(":::::::: :::: : : HHHHH HH HH HH");
  //   console.log(defaultBooking);
  //   console.log(":::::::: :::: : : HHHHH HH HH HH");
  // })
  // .catch(() => {
  //   console.log(":+++++++++++ HH");
  //   console.log("sacs");
  //   console.log(":+++++++++++ HH");
  // });
};

module.exports = { Bookings, addDefaultBooking };
