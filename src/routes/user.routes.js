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
  getProductsByCategory,
  // getFeaturedProducts,
  getAllProducts,
  getProductsGroupedByParentCategory,
  getProductsByCategorySlug
} = require("../controllers/products.controller.js");


const userRoutes = express.Router();


userRoutes.get("/", protect, getMyProfile);
userRoutes.put("/", protect, updateMyProfile);
userRoutes.delete("/", protect, deleteMyAccount);

userRoutes.get("/getActiveBanners", getActiveBanners);
userRoutes.get("/getCategories", formatedCategories);

userRoutes.get("/getProducts", getAllProducts);
userRoutes.get("/parentCategoryProducts", getProductsGroupedByParentCategory);
userRoutes.post("/getProductsByCategory", getProductsByCategory);
userRoutes.post("/getProductsByCategorySlug", getProductsByCategorySlug);
// userRoutes.get("/getFeaturedProducts", getFeaturedProducts);



module.exports = userRoutes;