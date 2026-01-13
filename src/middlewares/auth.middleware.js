const jwt = require("jsonwebtoken");

const User = require("../models/user.model");
const Staff = require("../models/staff.model");


const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

const staffProtect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token)
            return res.status(401).json({
                success: false,
                message: "Not authorized"
            });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await Staff.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};


const isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "admin" || req.user.status !== "approved")
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

const isVendor = (req, res, next) => {
    try {
        if (req.user.role !== "vendor" || req.user.status !== "approved")
            return res.status(403).json({
                success: false,
                message: "Access denied!"
            });
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};


module.exports = {
    protect,

    staffProtect,
    isAdmin,

    isVendor,
};