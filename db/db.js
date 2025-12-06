import { Sequelize, DataTypes } from "sequelize";
import "dotenv/config";

const db_url = process.env.DB_URL;
const sequelize = new Sequelize(db_url);

try {
  await sequelize.authenticate();
  console.log("Database connection successful");
} catch (e) {
  console.log("Database connection failed, reason: ", e);
  process.exit(1);
}

export const Contact = sequelize.define("contact", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  owner: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export const User = sequelize.define("users", {
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },
  token: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
});

// create table in DB if needed
(async () => {
  await sequelize.sync({});
})();
