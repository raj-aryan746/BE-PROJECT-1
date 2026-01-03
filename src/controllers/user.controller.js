import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
// import { log } from "console";


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()/* .toString() */;
        const refreshToken = user.generateRefreshToken()/* .toString() */;
        // console.log(refreshToken);
        

        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500,"something went wrong when generating Access and Refresh tokens  ")
    }
}

const registerUser = asyncHandler( async (req, res,) => {
    // get user detailes from frontfend

    const {fullName, userName, email, password} = req.body
    // console.log("email :: ",email);
    // console.log("body :: ",req.body);

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
    // console.log("files :: ",req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar File is compulsary")
    }

    // upload them to cloudinary, main avatar

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);
    // console.log("avatar :: ",avatar)


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

const logInUser = asyncHandler(async (req, res) => {
    // get data from req body
    // with which we login user userName, email
    // find user
    // password check
    // generate accesstoken refreshtoken 
    // send tokens to user in cookies

    // get data from req body

    const {userName, email, password} = req.body

    // with which we login user userName, email

    if (!(userName || email)){
        throw new ApiError(400,"username/email, password is required")
    }

    // find user

    const user = await User.findOne({
        $or: [{userName},{email}]
    })

    if (!user){
        throw new ApiError(404,"user dose not exist")
    }

    // password check

    const isPasswordValid = await user.isPasswardCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "invalid password")
    }

    // generate accesstoken refreshtoken 

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)
    

    // send tokens to user in cookies

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("accessToken", accessToken, "refreshToken",refreshToken);
    // console.log("ghjhgf",options);
    


    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, 
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "user is loggedin successfully"
    ))


});

const logOutUser = asyncHandler(async (req, res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out successfully"))

})

export { 
    registerUser,
    logInUser,
    logOutUser
 };


