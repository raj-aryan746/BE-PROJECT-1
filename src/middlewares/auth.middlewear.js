import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // 1️⃣ From cookies
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }
    console.log(token)


    // 2️⃣ From Authorization header
    if (!(token && req.headers.authorization?.startsWith("Bearer "))) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 3️⃣ If still no token
    if (!token || typeof token !== "string") {
      throw new ApiError(401, "Unauthorized request");
    }

    // 4️⃣ Verify token
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    // 5️⃣ Get user
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid access token");
  }
});
