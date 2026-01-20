const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASS
            }
        });

        await transporter.sendMail({
            from: `"Alinafe" <${process.env.SMTP_EMAIL}>`,
            to,
            subject,
            html
        });

    } catch (error) {
        console.error("Email error:", error.message);
    }
};

module.exports = sendEmail;
