import multer from 'multer';
import env from './config';

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, 'uploads_tmp');
    },
    filename: (req, file, cb)=>{
        let ext : any = file.mimetype.split('/');
        ext = ext[ext.length - 1].toLowerCase();
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9) + '.' + ext;
        cb(null, file.fieldname + '_' + uniqueSuffix)
    }
})
export default multer({ storage })