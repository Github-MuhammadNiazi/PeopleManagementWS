const constants = require('../../utils/constants');
module.exports = `
<div style="text-align: center;">
    <img 
        src="${constants.defaultConfigurations.systemVerifiedUrls[constants.defaultConfigurations.environment].images.appLogo}" 
        alt="Logo" 
        width="100" 
        style="display: inline-block; border: 0;" 
    />
</div>

<!-- Email Content Section -->
<div 
    style="background-color: #ffffff; padding: 40px; font-family: Arial, sans-serif; color: #333333;"
>
    <h1 style="font-size: 24px; margin: 0 0 10px;">Verify Your Email</h1>
    <p style="font-size: 16px; line-height: 24px; margin: 0 0 10px;">
        Thanks for helping us keep your account secure! Use the code shared below to reset your password.
    </p>
    <div style="margin: auto; text-align: center;">
        <span 
            style="
                font-size: 16px; 
                display: inline-block; 
                border-radius: 4px; 
                background-color: #27A8E7; 
                color: #ffffff; 
                padding: 12px 24px;
            "
        >
            {{RESET_CODE}}
        </span>
    </div>
    <p style="font-size: 14px; color: #777777; margin: 20px 0 0;">
        If you did not reset your password, no further action is required. This code will expire in {{TOKEN_EXPIRY}}.
    </p>
</div>

<!-- Footer Section -->
<div 
    style="padding: 20px; text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #777777;"
>
    <p style="margin: 0;">© {{CURRENT_YEAR}} {{TRADEMARK}}. All rights reserved.</p>
</div>
`;