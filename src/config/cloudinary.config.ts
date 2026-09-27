import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { envVariable } from './env';
import status from 'http-status';



    // Configuration
    cloudinary.config({ 
        cloud_name: envVariable.CLOUDINARY_CLOUD_NAME, 
        api_key: envVariable.CLOUDINARY_API_KEY, 
        api_secret: envVariable.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
    });
    
    //delete from cloudinary
    export const deleteFromCloudinary = async (url: string) => {
        try {
           const regex=/\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
           const match=url.match(regex);
           if(match && match[1]){
            const publicId=match[1];
            await cloudinary.uploader.destroy(
                publicId,
                { resource_type: 'image' }
            );
            console.log(`File with public ID ${publicId} deleted successfully.`);

           }
        }
        catch (error) {
            console.error('Error deleting file from Cloudinary:', error);
            //Todo AppError
            throw new Error( 'Failed to delete file from Cloudinary');
        }
    };

// Upload a file to Cloudinary
    export const uploadFiletoCloudinary=async(buffer: Buffer, fileName: string): Promise<UploadApiResponse> => {

        if(!buffer || !fileName){
            //todo AppError
            throw new Error('Buffer and fileName are required for uploading to Cloudinary');
        }


          //file name and extension
        
        const extension = fileName.split('.').pop()?.toLocaleLowerCase() || '';

            const fileNameWithoutExtension = fileName
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
           return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    public_id: uniqueName,
                    folder: `Azam-healthcare/${folder}`,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('Error uploading file to Cloudinary:', error);
                        //todo AppError
                       return reject(new Error('Failed to upload file to Cloudinary'));
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                 }
            ).end(buffer);

            })


    }
    //     // Upload an image
//      const uploadResult = await cloudinary.uploader
//        .upload(
//            'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg', {
//                public_id: 'shoes',
//            }
//        )
//        .catch((error) => {
//            console.log(error);
//        });
    
//     console.log(uploadResult);
    
//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url('shoes', {
//         fetch_format: 'auto',
//         quality: 'auto'
//     });
    
//     console.log(optimizeUrl);
    
//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url('shoes', {
//         crop: 'auto',
//         gravity: 'auto',
//         width: 500,
//         height: 500,
//     });
    
//     console.log(autoCropUrl);    
// })();

export const cloudinaryUpload = cloudinary;