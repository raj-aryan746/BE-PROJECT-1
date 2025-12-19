import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler( async (req, res,) => {
    // get user detailes from frontfend

    const {fullName, userName, email, password} = req.body
    console.log("email :: ",email);

    // validation -not empty

    if (
        [fullName,userName,email,password].some((field)=>field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are compulsory")
    }

    // check if user is already exists check with: "username, email"

    const existedUser = await User.findOne({
        $or: [{ userName },{ email }]
    })

    if (existedUser) {  
        throw new ApiError(409, `User with ${email} and ${userName} is already existed`)
    }

    // check for images, check for avatar 

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar File is compulsary")
    }

    // upload them to cloudinary, main avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);


    if (!avatar) {
        throw new ApiError(409, "Avatar File is compulsary")
    }

    // create user object -create entery in DB

    const user = await User.create(
        {
            userName: userName.toLowerCase(),
            fullName,
            email,
            password,
            avatar: avatar.url,
            coverImage: coverImage?.url || ""
        }
    )

    // remove password from and refresh token field from response 

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    // check for user creation
    
    if(!createdUser){
        throw new ApiError(500, "something went wrong while registering user")
    }

    // return response 

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    );
})



export { registerUser };


