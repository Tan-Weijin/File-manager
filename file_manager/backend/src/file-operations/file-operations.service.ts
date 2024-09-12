import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFileOperationDto } from './dto/create-file-operation.dto';
import { UpdateFileOperationDto } from './dto/update-file-operation.dto';
import path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { FileOperation } from './entities/file-operation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileOperationsService {
  constructor(
    @InjectRepository(FileOperation)
    // Injects a file repository to handle database operations
    private fileRepository: Repository<FileOperation>,
  ) {}

  // Function to create a new file entry in the database
  async create(file: Express.Multer.File) {
    // Create a new file entity with the given metadata
    const newFile = await this.fileRepository.save({
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileData: file.buffer
    });

    return "File successfully stored";
  }

  // Function that retrieves all files from the database
  findAll() {
    return this.fileRepository.find();
  }

  // Function that retrieves a file based on its ID
  async findOne(id: number) {
    // Search the file based on the given ID
    const newFile = await this.fileRepository.findOne({where: {
      fileID: id
    }
      });
      // Throws an error if the file doesn't exist
      if (!newFile){
        throw new BadRequestException("File does not exist")
      }
    // Extract required metadata based on the file
    let created = newFile.createdAt;
    let filename = newFile.originalName;
    let data = newFile.fileData;
    let mimeType = newFile.mimeType;
    // Returns the file metadata and data
    return {filename, created, data, mimeType};
  }

  // Function that updates the file's content or filename
  async update(body: { filename?: string; fileId?: string }, file: Express.Multer.File) {
    let extractedfilename = body.filename
    let extractedfieldID = body.fileId
    // Update the given file based on the given user input
    const updateFile = await this.fileRepository.update(extractedfieldID, {
      // Updates file data if a new file is provided
      ...(file?.buffer ? { fileData: file.buffer } : {}),
      // Updates the file name if provided
      ...(extractedfilename ? { originalName: extractedfilename } : {})
    });

    // If no rows were affected, throw an error that the file wasn't found
    if (updateFile.affected === 0) {
      throw new Error('File not found');
    }
    return {
      message: 'File updated successfully'
    };
  }

  // Functions that delete a file by its ID
  async remove(id: number) {
    return await this.fileRepository.delete(id);
  }
}
