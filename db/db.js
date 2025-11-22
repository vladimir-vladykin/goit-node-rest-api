import { Sequelize, DataTypes } from "sequelize";

const sequelize = new Sequelize(
  "postgresql://db_contacts_hloo_user:rhCOXk3Ksg0E1wFZQnm98sSOqTcUQorY@dpg-d4h32ifdiees73b9sq3g-a.frankfurt-postgres.render.com/db_contacts_hloo?sslmode=no-verify"
);

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
});
