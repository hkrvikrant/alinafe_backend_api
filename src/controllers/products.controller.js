const Product = require("../models/product.model");

// CREATE PRODUCT (VENDOR)
const createProduct = async (req, res) => {
    try {
        let {
            name,
            slug,
            description,
            price,
            discountedPrice,
            stock,
            sku,
            categories,
            short_description,
            brand,
            model,
            connectivity,
            warranty,
            inTheBox,
        } = req.body;

        if (typeof categories === "string") {
            categories = JSON.parse(categories);
        }

        if (!name ||
            !slug ||
            !price ||
            !stock ||
            !sku ||
            !Array.isArray(categories) ||
            categories.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields missing"
            });
        }

        const images = req.files
            ? req.files.map(file => `/uploads/images/${file.filename}`)
            : [];

        const product = await Product.create({
            vendorId: req.user._id,
            categories,
            name,
            slug,
            description,
            price,
            discountedPrice,
            stock,
            sku,
            images,
            short_description,
            brand,
            model,
            connectivity,
            warranty,
            inTheBox,
            status: "pending"
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully. Waiting for admin approval.",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//  GET ALL PRODUCTS (USER)
const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            status: "approved",
            isActive: true
        })
            .populate("categoryId", "name")
            .populate("vendorId", "name");

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE PRODUCT
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.body.id)
            .populate("categoryId", "name")
            .populate("vendorId", "name");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE PRODUCT (VENDOR)
const updateProduct = async (req, res) => {
    try {

        const product = await Product.findOne({
            _id: req.body.id,
            vendorId: req.user._id
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const {
            name,
            slug,
            description,
            price,
            discountedPrice,
            stock,
            sku,
            categories,
            short_description,
            brand,
            model,
            connectivity,
            warranty,
            inTheBox,
        } = req.body;

        let isUpdated = false;

        if (name) {
            product.name = name;
            isUpdated = true;
        }

        if (slug) {
            product.slug = slug;
            isUpdated = true;
        }

        if (description) {
            product.description = description;
            isUpdated = true;
        }

        if (price) {
            product.price = price;
            isUpdated = true;
        }

        if (short_description) {
            product.short_description = short_description;
            isUpdated = true;
        }

        if (brand) {
            product.brand = brand;
            isUpdated = true;
        }

        if (model) {
            product.model = model;
            isUpdated = true;
        }

        if (connectivity) {
            product.connectivity = connectivity;
            isUpdated = true;
        }

        if (warranty) {
            product.warranty = warranty;
            isUpdated = true;
        }

        if (inTheBox) {
            product.inTheBox = inTheBox;
            isUpdated = true;
        }

        if (discountedPrice) {
            product.discountedPrice = discountedPrice;
            isUpdated = true;
        }

        if (stock) {
            product.stock = stock;
            isUpdated = true;
        }

        if (sku) {
            product.sku = sku;
            isUpdated = true;
        }

        // ✅ Categories handling (FormData safe)
        if (categories) {
            let parsedCategories = categories;

            if (typeof categories === "string") {
                try {
                    parsedCategories = JSON.parse(categories);
                } catch {
                    parsedCategories = [categories];
                }
            }

            product.categories = parsedCategories;
            isUpdated = true;
        }

        // ✅ Images handling
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(
                file => `/uploads/images/${file.filename}`
            );

            product.images = [...product.images, ...newImages];
            isUpdated = true;
        }

        // 🔥 IMPORTANT: Reset status for re-approval
        if (isUpdated) {
            product.status = "pending";
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully and sent for re-approval",
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE PRODUCT (VENDOR)
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            { _id: req.body.id, vendorId: req.user._id },
            { isActive: false },
            { new: true }
        );

        if (!product) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ADMIN APPROVE / REJECT
const updateProductStatus = async (req, res) => {
    try {
        const { id, status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: `Product ${status}`,
            data: product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// VENDOR – OWN PRODUCTS
const getVendorProducts = async (req, res) => {
    try {
        const products = await Product.find({
            vendorId: req.user._id,
            isActive: true
        })
            .populate("categories", "name");

        res.status(200).json({
            success: true,
            data: products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//  GET ALL PRODUCTS (ADMIN)
const getAllProductsForAdmin = async (req, res) => {
    try {
        const {
            page,
            limit,
            status,
            search
        } = req.query;

        const query = {
            isActive: true
        };

        // 🔹 Filter by status
        if (status) {
            query.status = status;
        }

        // 🔹 Search by name or SKU
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { sku: { $regex: search, $options: "i" } }
            ];
        }

        const skip = (page - 1) * limit;

        const products = await Product.find(query)
            .populate("vendorId", "name email")
            .populate("categories", "name")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            data: products,
            pagination: {
                success: true,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    getVendorProducts,

    getAllProductsForAdmin,
};