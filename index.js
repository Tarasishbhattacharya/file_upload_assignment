const express=require("express");
const app=express();
const mongoose=require("mongoose");
const fs=require("fs")
const upload=require("./middleware/upload")
const connect=()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/upload")
}

// userschema
const userSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    profilePic:{type:String,required:true},

})
// user model
const User=mongoose.model("user",userSchema);
// galleryschema
const gallerySchema=new mongoose.Schema({
    img:[{type:String,required:true}],
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true}
})
// gallerymodel
const Gallery=mongoose.model("gallery",gallerySchema)

app.post("/user",upload.single("profilePic"),async(req,res)=>{
    try {
        const user= await User.create({
            firstName:req.body.firstName,
            lastName:req.body.lastName,
            profilePic:req.file.path,
        })
        return res.status(201).send(user)
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
})
app.post("/gallery",upload.any("img"),async(req,res)=>{
  try {
    const filepath= req.files.map((file)=>{
        return file.path
    })
    const user=await User.create({
        img:filepath,
        userId:req.body.userId
    })
    return res.status(201).send(user)
  } catch (error) {
    return res.status(500).send({message:"something went wrong"})
  }
})
app.delete("/user/:id",async(req,res)=>{
   try {
    const user=await User.findById(req.params.id).lean().exec();
    const delete_user=await User.findByIdAndDelete(req.params.id);
    const image=user.profilePic;
    fs.unlink(image);
    return res.status(202).send(delete_user)
   } catch (error) {
    return res.status(500).send({message:"something went wrong"})
   }

})

app.listen(9000,async()=>{
    await connect();
    console.log("listening on port 9000")
})