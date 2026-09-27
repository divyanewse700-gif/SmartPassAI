const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendNotificationEmail = async (to, subject, message) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message
        });

        console.log(`Notification email sent to ${to}`);
    } catch (error) {
        console.error("Email notification failed:", error.message);
        throw error;
    }
};

module.exports = {
    sendNotificationEmail
};