module.exports = `<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h2 {
            color: #333;
        }

        p {
            color: #555;
            font-size: 16px;
        }

        .code {
            font-size: 24px;
            font-weight: bold;
            color: #ff6600;
            background: #f4f4f4;
            display: inline-block;
            padding: 10px 20px;
            margin: 10px 0;
            border-radius: 5px;
        }

        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>We received a request to reset your password. Use the following reset code to proceed:</p>
        <div class="code">{{RESET_CODE}}</div>
        <p>If you did not request this, please ignore this email. This code will expire in {{TOKEN_EXPIRY}}.</p>
        <p>For security reasons, never share your reset code with anyone.</p>
        <p class="footer">&copy; {{CURRENT_YEAR}} {{TRADEMARK}}. All rights reserved.</p>
    </div>
</body>

</html>`;
