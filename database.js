const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("test-db", "user", "pass", {
  dialect: "sqlite",
  host: "./dev.sqlite",
  dialectOptions: {
    mode: "DELETE",
  },
});

async function deleteTable() {
  try {
    await sequelize.query('DROP TABLE IF EXISTS YourTable');
    console.log('Table "YourTable" deleted successfully');
  } catch (error) {
    console.error('Error deleting table:', error);
  }
}

deleteTable();
module.exports = sequelize;
