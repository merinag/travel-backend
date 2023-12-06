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
    description: "the hottest area & home to volcanon on Earth.",
    price: 4500.0,
  },
  {
    img: "spabrd.jpg",
    title: "SIMIEN",
    description: "the highest mountain in Ethiopia",
    price: 3000.0,
  },
  {
    img: "semen.jpg",
    title: "BAHIRDAR",
    description: "the place of nile river origin.",
    price: 3500.0,
  },
  {
    img: "coffe.jpg",
    title: "BONGA",
    description: "the green place & origion o coffee.",
    price: 2000.0,
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
