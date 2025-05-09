import multerInstance from '../config/multer';

export const profilePicUpload = multerInstance.single('profile_pic');
export const contentDocumentUpload = multerInstance.single('document');
export const uploadThumbnail = multerInstance.single('thumbnail');
export const uploadMedia = multerInstance.single('media');