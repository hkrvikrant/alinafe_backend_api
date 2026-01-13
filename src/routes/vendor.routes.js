const express = require("express");

const upload = require("../middlewares/upload");
const {
    staffProtect,
    isVendor,
} = require("../middlewares/auth.middleware");
const {
    getAllMainCategories,
    getCategoriesByParentID,
    formatedCategories,
} = require("../controllers/category.controller");
const { createProduct, updateProduct, getAllProducts, getProductById, deleteProduct, getVendorProducts } = require("../controllers/products.controller");


const vendorRoutes = express.Router();


vendorRoutes.get("/getAllMainCategories", staffProtect, isVendor, getAllMainCategories);
vendorRoutes.post("/getCategoriesByParentID", staffProtect, isVendor, getCategoriesByParentID);
vendorRoutes.get("/formatedCategories", staffProtect, isVendor, formatedCategories);

vendorRoutes.post("/createProduct", staffProtect, isVendor,
    upload.array("image", 5),
    createProduct);
vendorRoutes.get("/getVendorProducts", staffProtect, isVendor, getVendorProducts);
vendorRoutes.get("/getProductById", staffProtect, isVendor, getProductById);
vendorRoutes.post("/updateProduct", staffProtect, isVendor,
    upload.array("image", 5),
    updateProduct);
vendorRoutes.post("/deleteProduct", staffProtect, isVendor, deleteProduct);

vendorRoutes.get("/user/getAllProducts", getAllProducts);


module.exports = vendorRoutes;