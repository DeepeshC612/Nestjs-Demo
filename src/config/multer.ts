import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { diskStorage } from "multer";
import { extname } from "path";

export const multerConfig: MulterOptions = {
    dest: 'C:/Users/codiant/Desktop/nest js demo/nextjs-demo/src/uploads',
    storage: diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'C:/Users/codiant/Desktop/nest js demo/nextjs-demo/src/uploads')
        },
        filename: (req, file, cb) => {
            const fileName = `${file.originalname.split('.')[0]}.${Date.now()}${extname(file.originalname)}`
            cb(null, fileName)
        }
    })
}