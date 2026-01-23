const express = require("express");
const {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
} = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware.js");
const { getActiveBanners } = require("../controllers/banner.controller.js");
const { formatedCategories } = require("../controllers/category.controller.js");
const {
  getProductsByCategoryId,
  // getFeaturedProducts,
  getAllProducts,
  getProductsGroupedByParentCategory,
  getProductsByCategorySlug
} = require("../controllers/products.controller.js");
const {
  getCartList,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  mergeCart,
} = require("../controllers/cart.controller.js");


const userRoutes = express.Router();


userRoutes.get("/", protect, getMyProfile);
userRoutes.put("/", protect, updateMyProfile);
userRoutes.delete("/", protect, deleteMyAccount);

userRoutes.get("/getActiveBanners", getActiveBanners);
userRoutes.get("/getCategories", formatedCategories);

userRoutes.get("/getProducts", getAllProducts);
userRoutes.get("/parentCategoryProducts", getProductsGroupedByParentCategory);
userRoutes.post("/getProductsByCategoryId", getProductsByCategoryId);
userRoutes.post("/getProductsByCategorySlug", getProductsByCategorySlug);
// userRoutes.get("/getFeaturedProducts", getFeaturedProducts);

userRoutes.post("/cart", getCartList);
userRoutes.post("/cart/add", addToCart);
userRoutes.post("/cart/delete", clearCart);
userRoutes.put("/cart/update", updateCartItem);
userRoutes.post("/cart/item", removeCartItem);

userRoutes.post("/cart/merge", mergeCart);


module.exports = userRoutes;