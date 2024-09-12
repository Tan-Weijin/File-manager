import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { FileOperationsService } from './file-operations.service';
import { CreateFileOperationDto } from './dto/create-file-operation.dto';
import { UpdateFileOperationDto } from './dto/update-file-operation.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { Response} from "express"

@Controller('file-operations')
export class FileOperationsController {
  constructor(private readonly fileOperationsService: FileOperationsService) {}
  // Post endpoint to upload a file
  @Post('upload')
  @ApiConsumes('multipart/form-data')
  // Specifies the body of the post request to upload a file
  @ApiBody({
    schema:{
      type: 'object',
      properties:{
        file:{
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  // Intercepts the file given in the request and assigns it to a field
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Call service to create a new file in the database
    return this.fileOperationsService.create(file);
  }
  
  // Get endpoint to get all the files in the database
  @Get()
  findAll() {
    return this.fileOperationsService.findAll();
  }

  // Get endpoint to get a specific file in the database
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    // Call service to get the file based on the given ID
    const file = await this.fileOperationsService.findOne(+id);
    // Set the response header
    res.set({
      'Content-Disposition': `attachment; filename=${file.filename}`,
      'Content-Type': file.mimeType,
    });
    // Sends the file data as the response for download
    res.send(file.data);
  }

  // Post endpoint to update the file's content or it's filename
  @Post('update')
  @ApiConsumes('multipart/form-data')
  // Specifies the body of the post request to update a file
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        },
        filename: {
          type: 'string',
          description: 'Optional new filename to update if no new file is uploaded'
        },
        fileId: {
          type: 'string',
          description: 'ID of the file to update'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file'))
  async update(@Body() body: { filename?: string; fileId?: string }, @UploadedFile() file: Express.Multer.File){
    // Calls the service that handles file updates
    return await this.fileOperationsService.update(body, file);
  }

  // Delete endpoint to remove a file by ID
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Calls the service to delete the file by its ID
    return this.fileOperationsService.remove(+id);
  }
}
