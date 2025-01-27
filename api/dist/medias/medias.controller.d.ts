import { MediasService } from './medias.service';
import { DeleteFileDto } from './dto/delete-files.dto';
export declare class MediasController {
    private mediasService;
    constructor(mediasService: MediasService);
    uploadFiles(files: Array<Express.Multer.File>): Promise<{
        key: string;
        url: string;
        mediaType: string;
    }[]>;
    deleteFiles(body: DeleteFileDto): Promise<{
        statusCode: number;
        message: string;
    }>;
}
