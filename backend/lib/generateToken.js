import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "12h" 
    });

    res.cookie("token", token, {
        httpOnly: true,                
        sameSite: "strict",            
        secure: process.env.NODE_ENV === "production", 
        maxAge: 1000 * 60 * 60 * 12
    });

    return token;
};
