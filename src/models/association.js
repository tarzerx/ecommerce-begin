const Product = require('./product');
const ProductImage = require('./productImage');
const ProductVariation = require('./productvariation');
const ProductVariationOption = require('./productvariationoption');
const Stock = require('./stock');
const User = require('./user');
const Cart = require('./cart');
const CartItem = require('./cartItem');



Product.hasMany(ProductImage, { 
    foreignKey: 'productId',
    as: 'images', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',  
});


Product.hasMany(ProductVariation, {
    foreignKey: 'productId',
    as: 'productVariations', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});


User.hasMany(Product, {
    foreignKey: 'sellerId',
    as: 'seller', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});


ProductVariation.hasMany(ProductVariationOption, {
    foreignKey: 'productVariationId',
    as: 'productVariationOptions', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE', 
});


ProductVariationOption.hasMany(Stock, {
    foreignKey: 'productVariationOptionId',
    as: 'stocks', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});


Stock.belongsTo(ProductVariationOption, {
    foreignKey: 'productVariationOptionId',
    as: 'stockproductVariationOption', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',  
});




ProductVariation.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});


Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'cartItems', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});

CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart', 
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});



module.exports = {
    Product,
    ProductImage,
    ProductVariation,
    ProductVariationOption,
    Stock,
    User,
    Cart,
    CartItem,

};
