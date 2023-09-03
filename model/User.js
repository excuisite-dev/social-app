const mongoose = require("mongoose");
// console.log(mongoose.connections);
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:3,
        max:20,
        unique:true
    },
    email:{
        type:String,
        required:true,
        max:20,
        unique:true
    },
    password:{
        type:String,
        required:true,
        min:6
    },
    prifilePicture:{
        type:String,
        defualt:""
    },
    coverPicture:{
        type:String,
        defualt:""
    },
    followers:{
        type:Array,
        default:""
    },
    following:{
        type:Array,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:Number,
        enum:[1,2,3]
    }
},
{ timestamps:true }
);

module.exports = mongoose.model("User", userSchema);