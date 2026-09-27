import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinaryUpload } from './cloudinary.config';
import { Request } from 'express';
import multer from 'multer';
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req:Request,file) => {
    //file name and extension
    const originalName = file.originalname ;
    const extension = originalName.split('.').pop()?.toLocaleLowerCase() || '';

    const fileNameWithoutExtension = originalName
    .split('.')
    .slice(0, -1)
    .join('.').toLocaleLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9_-]/g, ''); // Remove special characters
    //unique name for the file
    const uniqueName =Math
    .random()
    .toString(36)
    .substring(2) 
    + "_"+Date.now() 
    + "_" 
    + fileNameWithoutExtension; 
    const folder = extension === 'pdf' ? 'pdfs' : 'images';

    return {
      folder: `Azam-healthcare/${folder}`,
      public_id: uniqueName,
      resource_type: 'auto',
    };


  }});

  export const multerUpload =multer({ storage: storage }); 
