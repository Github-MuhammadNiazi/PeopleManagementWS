var passwordResetEmailHtml = require('../templates/email/passwordResetCodeTemplate.js');

module.exports = {
    resetCodeForPasswordTemplate: {
        subject: 'Password Reset Code.',
        htmlContent: passwordResetEmailHtml,
        smsContent: 'Your password reset code for {{APP_NAME}} is: {{RESET_CODE}}. This code will expire in {{TOKEN_EXPIRY}} minutes.',
    },
};
