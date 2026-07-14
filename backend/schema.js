import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/vercel')

const schema = mongoose.Schema({
    url:{
        type:String,
        trim:true,
    },
    shorturl:{
        type:String,
        trim:true,
    },
    isprotected:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
        trim:true,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const urlshortner = mongoose.model('urlshortner',schema)

export default urlshortner

