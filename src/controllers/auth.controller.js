const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/user.model");
const Staff = require("../models/staff.model");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};

const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, acceptTerms } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists)
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            acceptTerms,
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const registerStaff = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            role,
            status,
            shopName,
            commissionPercent,
            accountHolderName,
            accountNumber,
            ifscCode,
            bankName,
        } = req.body;

        const emailExists = await Staff.findOne({ email });
        if (emailExists)
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Staff.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role,
            status,
            shopName,
            commissionPercent,
            bankDetails: {
                accountHolderName,
                accountNumber,
                ifscCode,
                bankName,
            }
        });

        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                shopName: user.shopName,
                commissionPercent: user.commissionPercent,
                bankDetails: {
                    accountHolderName: user.bankDetails.accountHolderName,
                    accountNumber: user.bankDetails.accountNumber,
                    ifscCode: user.bankDetails.ifscCode,
                    bankName: user.bankDetails.bankName,
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const loginStaff = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Staff.findOne({ email });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });

        res.status(200).json({
            success: true,
            token: generateToken(user._id),
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                shopName: user.shopName,
                commissionPercent: user.commissionPercent,
                bankDetails: {
                    accountHolderName: user.bankDetails.accountHolderName,
                    accountNumber: user.bankDetails.accountNumber,
                    ifscCode: user.bankDetails.ifscCode,
                    bankName: user.bankDetails.bankName,
                }
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
    registerUser,
    loginUser,

    registerStaff,
    loginStaff,
};