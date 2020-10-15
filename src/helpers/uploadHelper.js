<<<<<<< HEAD
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(!file){
            return cb(new Error('Image cant be null'), false);
        }
        cb(null, 'assets/uploads')
    },
    filename: (req, file, cb)=>{
        const ext = file.originalname.split('.')[file.originalname.split('.').length-1]
        const fileName = `${req.user.id}_${new Date().getTime().toString().concat('.').concat(ext)}`
        cb(null, fileName)
    }
})

let fileFilter = (req, file, cb) => {
    var allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG', 'image/svg+xml'];
     if (allowedMimes.includes(file.mimetype)) {
        return cb(null, true)
     }
        return cb(new Error('Invalid file type. Only image files are allowed.'), false);
}

=======
const multer = require('multer')


const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        if(!file){
            return cb(new Error('Image cant be null'), false);
        }
        cb(null, 'assets/uploads')
    },
    filename: (req, file, cb)=>{
        const ext = file.originalname.split('.')[file.originalname.split('.').length-1]
        const fileName = `${req.user.id}_${new Date().getTime().toString().concat('.').concat(ext)}`
        cb(null, fileName)
    }
})

let fileFilter = (req, file, cb) => {
    var allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/PNG', 'image/svg+xml'];
     if (allowedMimes.includes(file.mimetype)) {
        return cb(null, true)
     }
        return cb(new Error('Invalid file type. Only image files are allowed.'), false);
}

>>>>>>> 9165feeb50354381da006e2ff4f6ade3ebbe85b5
module.exports = multer({storage, fileFilter, limits: { fileSize: 2000000 }}).single('picture')