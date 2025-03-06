import multer from "multer";


const storage=multer.diskStorage({
destination:"uploads",
filename:(req,file,cb)=>{
return cb(null,`${Date.now()}${file.originalname}`);
}

});

const isImage=(req,file,cb)=>{
    if(file.mimetype.startsWith("image/")){
        cb(null,true);
    }else {
        cb(new Error('Only image files are allowed!'), false);  
      }
}

const upload=multer({
storage:storage,
fileFilter:isImage
});

export default upload;