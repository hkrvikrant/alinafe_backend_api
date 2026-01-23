const Cart = require("../models/cart.model");


/* Utility */
const calculateTotals = (cart) => {
    let totalQty = 0;
    let totalPrice = 0;

    cart.items.forEach(item => {
        totalQty += item.quantity;
        totalPrice += item.quantity * item.price;
    });

    cart.totalQuantity = totalQty;
    cart.totalPrice = totalPrice;
};


// GET CART
const getCartList = async (req, res) => {
    try {

        const { guestId } = req.body;
        const userId = req.user?._id;

        let cart = null;

        if (userId) {
            cart = await Cart.findOne({ userId })
                .populate("items.productId");
        } else if (guestId) {
            cart = await Cart.findOne({ guestId })
                .populate("items.productId");
        }

        res.status(200).json({
            success: true,
            data: cart || {}
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

// ADD ITEM TO CART
const addToCart = async (req, res) => {
    try {
        const { guestId, productId, variantId, quantity, price } = req.body;
        const userId = req.user?._id || null;

        let cart = await Cart.findOne({
            $or: [{ guestId }, { userId }]
        });

        if (!cart) {
            cart = new Cart({
                guestId,
                userId,
                isGuest: !userId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                items: []
            });
        }

        const existingItem = cart.items.find(
            item =>
                item.productId.toString() === productId &&
                item.variantId?.toString() === variantId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, variantId, quantity, price });
        }

        cart.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        calculateTotals(cart);
        await cart.save();

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* UPDATE ITEM */
const updateCartItem = async (req, res) => {
    try {
        const { guestId, productId, variantId, quantity } = req.body;
        const userId = req.user?._id || null;

        let cart = await Cart.findOne({
            $or: [{ guestId }, { userId }]
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Update quantity
        cart.items.forEach(item => {
            if (
                item.productId.toString() === productId &&
                item.variantId?.toString() === variantId
            ) {
                item.quantity = quantity;
            }
        });

        calculateTotals(cart);
        await cart.save();

        // 🔥 IMPORTANT: populate full product details
        cart = await Cart.findById(cart._id)
            .populate({
                path: "items.productId",
                // select: "name slug price sellingPrice images stock"
            })
        // .populate({
        //     path: "items.variantId"
        // });

        res.status(200).json({
            success: true,
            data: cart
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


/* REMOVE ITEM */
const removeCartItem = async (req, res) => {
    try {
        const { guestId, productId, variantId } = req.body;
        const userId = req.user?._id || null;

        const cart = await Cart.findOne({
            $or: [{ guestId }, { userId }]
        });

        cart.items = cart.items.filter(
            item =>
                !(
                    item.productId.toString() === productId &&
                    item.variantId?.toString() === variantId
                )
        );

        calculateTotals(cart);
        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.productId")

        res.status(200).json({
            success: true,
            data: updatedCart,
            // data: cart
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* CLEAR CART */
const clearCart = async (req, res) => {
    const { guestId } = req.body;
    const userId = req.user?._id || null;

    await Cart.findOneAndUpdate(
        { $or: [{ guestId }, { userId }] },
        { items: [], totalQuantity: 0, totalPrice: 0 }
    );

    res.status(200).json({
        success: true,
        message: "Cart cleared"
    });
};

/* MERGE GUEST CART AFTER LOGIN */
const mergeGuestCartIntoUserCart = async (req, res) => {
    try {
        const { guestId } = req.body;
        const userId = req.user?._id;

        const guestCart = await Cart.findOne({ guestId });
        if (!guestCart || guestCart.items.length === 0) return;

        let userCart = await Cart.findOne({ userId });

        // If user cart does not exist, just assign guest cart to user
        if (!userCart) {
            guestCart.userId = userId;
            guestCart.guestId = null;
            guestCart.isGuest = false;
            await guestCart.save();
            return;
        }

        // Merge items properly
        for (const guestItem of guestCart.items) {
            const existingItem = userCart.items.find(
                item =>
                    item.productId.toString() === guestItem.productId.toString() &&
                    item.variantId?.toString() === guestItem.variantId?.toString()
            );

            if (existingItem) {
                // Increase quantity
                existingItem.quantity += guestItem.quantity;
            } else {
                // Push new item
                userCart.items.push(guestItem);
            }
        }

        // Recalculate totals
        calculateTotals(userCart);
        await userCart.save();

        // Delete guest cart
        await Cart.deleteOne({ guestId });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    // getOrCreateCart,
    getCartList,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    mergeGuestCartIntoUserCart,
};