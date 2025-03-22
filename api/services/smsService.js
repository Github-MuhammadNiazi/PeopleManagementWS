const axios = require("axios");
const constants = require("../utils/constants");

const BREVO_API_KEY = process.env.BREVO_API_KEY;

async function sendSMS(phoneNumber, message) {
    const url = "https://api.brevo.com/v3/transactionalSMS/sms";
    
    const data = {
        sender: constants.defaultConfigurations.appNameShort,
        // Make sure that phone number includes country code and is in E.164 format. For example, +14155552671 for US number.
        recipient: phoneNumber,
        content: message
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json",
                "api-key": BREVO_API_KEY
            }
        });

        console.log("SMS sent successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error sending SMS:", error.response?.data || error.message);
        throw error;
    }
}

module.exports = { sendSMS };
