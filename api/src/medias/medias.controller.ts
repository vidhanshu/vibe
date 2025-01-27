import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MediasService } from './medias.service';
import { DeleteFileDto } from './dto/delete-files.dto';
import {
  ALLOWED_FILE_TYPE_REGEX,
  MAX_FILE_SiZE,
  MAX_FILES_LIMIT,
} from './constants/limits';

@Controller('medias')
export class MediasController {
  constructor(private mediasService: MediasService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', MAX_FILES_LIMIT))
  uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: MAX_FILE_SiZE,
            message: 'File size is should be less than 30MB',
          }),
          new FileTypeValidator({ fileType: ALLOWED_FILE_TYPE_REGEX }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    return this.mediasService.uploadFiles(files);
  }

  @Delete('delete')
  deleteFiles(@Body() body: DeleteFileDto) {
    return this.mediasService.deleteFiles(body.keys);
  }
}
