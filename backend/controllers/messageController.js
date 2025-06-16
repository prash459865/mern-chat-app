import Users from '../models/User.js'
import Messages from '../models/message.js'
import cloudinary from '../lib/cloudinary.js';

export const allUsers = async(req,res)=>{
    const {selfId} = req.body;
    if(!selfId)
    {
        return res.status(400).json({success:false,message:"id not provided"})
    }
    try {
    const allUsers = await Users.find({_id:{$ne:selfId}}).select("-password");
    res.status(200).json({allUsers});
    } catch (error) {
        console.log("error in getting allUsers",error)
    }
}


export const allMessage = async(req,res)=>{
    try {
        const {myId,toChatId} = req.body;
        const messages = await Messages.find({
            $or:[
                {senderId:myId,recieverId:toChatId},
                {senderId:toChatId,recieverId:myId}
            ]
        })
        res.status(200).json({messages});
    } catch (error) {
        
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { recieverId, senderId, text } = req.body;
        let imageURL = "";

        if (req.file) {
            const fileBuffer = req.file.buffer;
            const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

            const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'media',
                resource_type: 'auto',
            });

            imageURL = uploadedResponse.secure_url;
        }

        const newMessage = new Messages({
            senderId,
            recieverId,
            text,
            image: imageURL,
        });
        await newMessage.save();

        res.status(200).json({ success: true, newMessage });

    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
};

export const updateProfileImage = async(req,res)=>{
    try {
        const {selfId,name,email} = req.body;
        let imageURL = '';
        if(!req.file)
        {
            console.log("profile not")
        }
        if(req.file)
        {
            const fileBuffer = req.file.buffer;
            const base64Image = `data:${req.file.mimetype};base64,${fileBuffer.toString('base64')}`;

             const uploadedResponse = await cloudinary.uploader.upload(base64Image, {
                folder: 'media',
                resource_type: 'auto',
            });

            imageURL = uploadedResponse.secure_url;
            
        }
        
        await Users.findByIdAndUpdate(selfId,{
            profileImage:imageURL,
            name:name,
            email:email
        })
        return res.status(200).json({success:true,message:"Profile updated"})
    } catch (error) {
        console.error("Error in sendMessage controller:", error);
        res.status(500).json({ success: false, error: "Unable to upadte profile " });
    }
}