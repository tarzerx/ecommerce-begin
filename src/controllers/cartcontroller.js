const Cart = require("../models/cart");
const CartItem = require("../models/cartItem");
const ProductVariation = require("../models/productvariation");
const Stock = require("../models/stock");
const sequelize = require("../config/database");
const Product = require("../models/product");
const ProductVariationOption = require("../models/productvariationoption");

exports.addItemToCart = async (req, res) => {
  const { productVariationOptionId, quantity } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: "Only buyers can add items to the cart" });
  }

  try {
    const variationOption = await ProductVariationOption.findOne({
      where: { id: productVariationOptionId },
      include: [
        {
          model: ProductVariation,
          as: 'productVariation',
          attributes: ['variationPrice']
        }
      ]
    });

    if (!variationOption) {
      return res.status(404).json({ message: "Product variation option not found" });
    }

    const stock = await Stock.findOne({
      where: { productVariationOptionId: productVariationOptionId }
    });

    if (!stock || stock.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    let cart = await Cart.findOne({
      where: { userId: req.user.id }
    });

    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, totalPrice: 0.0 });
    }

    const unitPrice = variationOption.productVariation.variationPrice;
    const totalPrice = unitPrice * quantity;

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { cartId: cart.id, productVariationOptionId },
      defaults: { quantity, unitPrice, totalPrice }
    });

    if (!created) {
      const newQuantity = cartItem.quantity + quantity;
      if (stock.quantity < newQuantity) {
        return res.status(400).json({ message: "Not enough stock available for this item" });
      }

      await cartItem.update({ quantity: newQuantity, totalPrice: unitPrice * newQuantity });
    }

    const updatedTotalPrice = await CartItem.sum('totalPrice', {
      where: { cartId: cart.id }
    });

    await cart.update({ totalPrice: updatedTotalPrice });

    res.status(200).json({ cart });
  } catch (err) {
    console.error("Error adding item to cart:", err);
    res.status(500).json({ message: "Server error while adding item to cart" });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { id } = req.params;

  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: "Only buyers can remove items from the cart" });
  }

  try {
    const cartItem = await CartItem.findOne({
      where: { id: id },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { userId: req.user.id }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cartItem.destroy();

    const updatedTotalPrice = await CartItem.sum('totalPrice', {
      where: { cartId: cartItem.cartId }
    });

    const totalPrice = updatedTotalPrice || 0;
    const cart = await Cart.findByPk(cartItem.cartId);

    if (totalPrice === 0) {
      await cart.destroy();
      return res.status(200).json({ message: "Cart is empty and removed successfully" });
    }

    await cart.update({ totalPrice: totalPrice });
    res.status(200).json({ message: "Item removed from cart successfully", cart });
  } catch (err) {
    console.error("Error removing item from cart:", err);
    res.status(500).json({ message: "Server error while removing item from cart" });
  }
};

exports.viewCart = async (req, res) => {
  if (!req.user || !req.user.id) {
    return res.status(400).json({ message: "User not authenticated" });
  }

  if (req.user.role !== 'buyer') {
    return res.status(403).json({ message: "Only buyers can view the cart" });
  }

  try {
    const cart = await Cart.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: CartItem,
          as: 'cartItems',
          include: [
            {
              model: ProductVariationOption,
              as: 'productVariationOption',
              attributes: ['id', 'value'], 
              include: [
                {
                  model: ProductVariation,
                  as: 'productVariation',
                  attributes: ['variationPrice'],
                  include: [
                    {
                      model: Product,
                      as: 'product',
                      attributes: ['name', 'description']
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found or is empty" });
    }

    res.status(200).json({ cart });
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error while fetching cart" });
  }
};
