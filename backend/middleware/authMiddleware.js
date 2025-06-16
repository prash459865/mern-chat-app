import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user; 
        next(); 
    } catch (error) {
        console.log("Error in protecteRoute:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export default protectedRoute;
