const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Cart = sequelize.define(
  "carts",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00, 
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "carts",
  }
);


Cart.belongsTo(User, { foreignKey: "userId", as: "user" });

(async () => {
  await Cart.sync();
  console.log("Cart table created");
})();

module.exports = Cart;
