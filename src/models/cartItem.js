const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Cart = require("./cart"); 
const ProductVariationOption = require("./productvariationoption");

const CartItem = sequelize.define(
  "cartItems",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cart,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    productVariationOptionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProductVariationOption,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
    tableName: "cart_items",
  }
);


// CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });
CartItem.belongsTo(ProductVariationOption, { foreignKey: "productVariationOptionId", as: "productVariationOption" });

module.exports = CartItem;
