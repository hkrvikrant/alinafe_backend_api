const vendorWelcomeEmail = (vendorName) => {
    return `
        <h2>Welcome to Alinage 🎉</h2>
        <p>Hi <strong>${vendorName}</strong>,</p>

        <p>Your vendor account has been created successfully.</p>

        <p>You can now log in and start adding your products.</p>
        <p>Seller account URL: www.testing.com</p>

        <br/>
        <p>Regards,</p>
        <p><strong>Alinafe Team</strong></p>
    `;
};

module.exports = vendorWelcomeEmail;
