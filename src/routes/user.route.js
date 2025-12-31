import { Router } from "express";
import { logInUser, logOutUser, registerUser } from "../controllers/user.contronller.js";
import { upload } from "../middlewears/multer.middlewears.js"
import { verifyJWT } from "../middlewears/authentication.middlewear.js";

const userRouter = Router()

userRouter.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },{
            name: "coverImage",
            maxCount: 1
        }
    ]),
    
    registerUser
)

userRouter.route("/logIn").post(logInUser)

// secured routes

userRouter.route("/logOut").post(verifyJWT, logOutUser)

export default userRouter   