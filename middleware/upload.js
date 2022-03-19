
const path=require("path")
const multer=require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null,"./uploads/");
    },
    filename: function (req, file, callback) {
      const uniqueprefix = Date.now();
      callback(null, uniqueprefix + '-' +file.originalname)
    }
  })
  function fileFilter (req, file, callback) {
     if(file.mimetype=="image/jpeg" || file.mimetype=="image/png"){
        callback(null, true)
     }else{
        callback(null, false)
     }
  }


const option={
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize:1024*1024*5,
    }
}
const upload=multer(option);
module.exports=upload