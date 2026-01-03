import { Router } from "express";
import { logInUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middlewears.js";
import { verifyJWT } from "../middlewares/authorization.middlewear.js";

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