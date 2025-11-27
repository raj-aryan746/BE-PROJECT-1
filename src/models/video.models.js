import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const videoSchema = new Schema(
    {
        videoFile:{
            type: String, // cloudinary uri 
            required: [true, "video file is importent"],
        },
        thumbnail:{
            type: String, //cloudinary uri
            required: true,
        },
        title:{
            type: String,
            required: [true, "without title we are not justify video"],
        },
        discription:{
            type: String,
            required: [true, "give the overview of the inside of video"],
        },
        duration:{
            type: Number, // cloudinary uri
            required: true,
        },
        views:[
            {
                type: Number,
                default: 0,
            }
        ],
        isPublished:{
            type: Boolean,
            default: true,
        },
        owner:{
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true,
    }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video",videoSchema);