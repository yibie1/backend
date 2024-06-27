const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/product')
    },
    filename: function (req, file, cb) {

      cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname)
    }
  })

  // spicify file format


function fileFilter (req, file, cb) {

    if(
         file.mimetype === 'image/jpg' ||
         file.mimetype === 'image/jpeg' ||
         file.mimetype === 'image/png'

    ){
        cb(null, true)
    }else{
         cb(null, false)
    }

  }

  const upload = multer({ storage, fileFilter })
  //file size fromater
  const fileSizeFormater = (bytes, decimal) =>{
    if(bytes === 0){
        return "0 Bytes"
    }
    const dm = decimal || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB",
   "YB", "ZB"];
   const index = Math.floor(Math.log(bytes) / Math.log(1000));
   return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm) + " " + sizes[index] )
   )
  }

  module.exports = {upload, fileSizeFormater}