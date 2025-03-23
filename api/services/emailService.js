const axios = require("axios");
const constants = require("../utils/constants");
const winston = require("../utils/winston");
const BREVO_API_KEY = process.env.BREVO_API_KEY;

async function sendEmail(to, subject, text) {
    const url = "https://api.brevo.com/v3/smtp/email";
    winston.info([
        `Sending Email.`,
        `Recipient: ${to}`,
        `Subject: ${subject}`
    ].join("\n"));
    const data = {
        sender: { email: constants.defaultConfigurations.systemVerifiedEmails.dev.support, name: constants.defaultConfigurations.appName },
        to: [{ email: to }],
        subject: subject,
        textContent: text
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

module.exports = { sendEmail };
