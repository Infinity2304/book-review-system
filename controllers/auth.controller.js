import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { userName, password } = req.body;

        const user = await User.findOne({ userName });

        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }

        //HASHING PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            userName,
            password: hashedPassword,
        })

        if (newUser) {
            //Generate JWT token here
            generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                userName: newUser.userName,
            });
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }


    } catch (error) {
        console.log('Error in signup controller', error.message);
        res.status(500).json({ error: "Internal Server Error" })
    }
}

export const login = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const user = await User.findOne({userName});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error: "Invalid username or password"});
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user.id,
            userName: user.userName,
        });
        
    } catch (error) {
        console.log('Error in login controller', error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
