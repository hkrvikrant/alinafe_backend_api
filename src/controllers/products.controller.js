const Category = require("../models/category.model");
const Product = require("../models/product.model");

// CREATE PRODUCT (VENDOR)
const createProduct = async (req, res) => {
    try {
        let {
            name,
            slug,
            description,
            price,
            sellingPrice,
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

        // 🔹 Convert to numbers
        price = Number(price);
        sellingPrice = sellingPrice ? Number(sellingPrice) : null;

        // 🔹 Discount calculation
        let discountAmount = 0;
        let discountPercentage = 0;

        if (sellingPrice && sellingPrice < price) {
            discountAmount = price - sellingPrice;
            discountPercentage = Math.round(
                (discountAmount / price) * 100
            );
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
            sellingPrice,
            discountAmount,
            discountPercentage,
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
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("categories", "name slug")
            .populate("vendorId", "name")

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

// GET SINGLE PRODUCT (USER)
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.body.id)
            .populate("categories", "name")
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
        const {
            id,
            name,
            slug,
            description,
            price,
            sellingPrice,
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

        const product = await Product.findOne({
            _id: id,
            vendorId: req.user._id,
        });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

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

        if (sku) {
            product.sku = sku;
            isUpdated = true;
        }


        // 🔹 Numbers
        if (price !== undefined) {
            product.price = Number(price);
            isUpdated = true;
        }

        if (sellingPrice !== undefined) {
            product.sellingPrice = Number(sellingPrice);
            isUpdated = true;
        }

        if (stock !== undefined) {
            product.stock = Number(stock);
            isUpdated = true;
        }

        if (
            product.sellingPrice &&
            product.price &&
            product.sellingPrice > product.price
        ) {
            return res.status(400).json({
                success: false,
                message: "Selling price cannot be greater than MRP",
            });
        }

        // 🔹 Categories (FormData safe)
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

        // 🔹 Images
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(
                file => `/uploads/images/${file.filename}`
            );

            product.images = [...product.images, ...newImages];
            isUpdated = true;
        }

        // 🔥 Auto discount calculation
        if (
            product.price &&
            product.sellingPrice &&
            product.sellingPrice < product.price
        ) {
            product.discountAmount = product.price - product.sellingPrice;
            product.discountPercentage = Math.round(
                (product.discountAmount / product.price) * 100
            );
        } else {
            product.discountAmount = 0;
            product.discountPercentage = 0;
        }

        // 🔁 Send again for approval if changed
        if (isUpdated) {
            product.status = "pending";
        }

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully and sent for re-approval",
            data: product,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
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
            {
                status,
                isActive: status === 'approved' ? true : false
            },
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
            // isActive: true
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
            // isActive: true
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

const getProductsGroupedByParentCategory = async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $match: {
                    isActive: true,
                    $or: [
                        { parentId: null },
                        { parentId: { $exists: false } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "products",
                    let: { categoryId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ["$$categoryId", "$categories"] },
                                        { $eq: ["$isActive", true] },
                                        { $eq: ["$status", "approved"] }
                                    ]
                                }
                            }
                        },
                        { $sort: { createdAt: -1 } },

                        // Limit products per category
                        { $limit: 10 },

                        // 🔥 Convert category IDs → objects
                        {
                            $lookup: {
                                from: "categories",
                                localField: "categories",
                                foreignField: "_id",
                                as: "categories"
                            }
                        },

                        // 🔥 Keep ALL product fields, only transform categories
                        {
                            $addFields: {
                                categories: {
                                    $map: {
                                        input: "$categories",
                                        as: "cat",
                                        in: {
                                            _id: "$$cat._id",
                                            name: "$$cat.name",
                                            slug: "$$cat.slug"
                                        }
                                    }
                                }
                            }
                        }
                    ],
                    as: "products"
                }
            },

            // 3️⃣ Final category response
            {
                $project: {
                    name: 1,
                    slug: 1,
                    image: 1,
                    products: { $ifNull: ["$products", []] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET PRODUCT BY CATEGORY (USER)
const getProductsByCategoryId = async (req, res) => {
    try {
        const products = await Product.find({
            categories: req.body.id,
            isActive: true,
            status: "approved"
        })
            .populate("categories", "name slug")
            .populate("vendorId", "fullName")
            .sort({ createdAt: -1 });

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

// GET PRODUCT BY CATEGORY SLUG (USER) 
const getProductsByCategorySlug = async (req, res) => {
    try {
        const { slug } = req.body;

        const category = await Category.findOne({
            slug,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // 2️⃣ Find products using category _id
        const products = await Product.find({
            categories: category._id,
            isActive: true,
            status: "approved"
        })
            .populate("categories", "name slug")
            .populate("vendorId", "fullName")
            .sort({ createdAt: -1 });

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

// FEATURE / LATEST PRODUCTS (USER)
// const getFeaturedProducts = async (req, res) => {
//     try {
//         const products = await Product.find({
//             isActive: true,
//             status: "approved",
//         })
//             .populate("category", "name")
//             .limit(10)
//             .sort({ createdAt: -1 })

//         res.status(200).json({
//             success: true,
//             data: products
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: error.message
//         });
//     }
// };

const getProducts = async (req, res) => {
    try {
        const {
            category,
            vendor,
            search,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;

        let filter = {
            isActive: true,
            status: "approved" // only approved products
        };

        if (category) filter.category = category;
        if (vendor) filter.vendor = vendor;

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const products = await Product.find(filter)
            .populate("category", "name slug")
            .populate("vendor", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Product.countDocuments(filter);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: products
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

    getProductsByCategoryId,
    getProductsGroupedByParentCategory,
    getProductsByCategorySlug,
    // getFeaturedProducts,
};