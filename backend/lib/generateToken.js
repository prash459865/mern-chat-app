import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "12h" // 1h, 1d, 1m, 1s, 3600(means 1 hour)
    });

    res.cookie("token", token, {
        httpOnly: true,                // Protects against XSS
        sameSite: "strict",            // Correct spelling!
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
        maxAge: 1000 * 60 * 60 * 12
    });

    return token;
};
