import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        // ref: "User", // Liên kết với bảng User
        required: true
    },
    content:{
        type:String,
        required:true,
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    image:{
        type:String,
        default:'https://img.freepik.com/free-photo/online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.jpg',
    },
    category:{
        type:String,
        default:'Chưa phân loại',
    },
    slug:{
        type:String,
        required:true,
        unique:true,
    },
    isApproved: {
        type: Boolean,
        default: false, // Bài viết mặc định chưa được duyệt
    }
},{timestamps: true})

const Post = mongoose.model('Post', postSchema);

export default Post;