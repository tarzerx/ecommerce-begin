const express = require("express");
const cartController = require("../controllers/cartcontroller");
const authenticate = require("../middleware/authenticate");

const router = express.Router();


router.post(
  "/add-item",
  authenticate,
  cartController.addItemToCart
);

router.delete(
  "/remove-item/:id",
  authenticate,
  cartController.removeItemFromCart
);

router.get(
  "/view-cart",
  authenticate,
  cartController.viewCart
);


module.exports = router;