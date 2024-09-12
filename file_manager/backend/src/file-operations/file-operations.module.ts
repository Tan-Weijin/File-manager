import { Module } from '@nestjs/common';
import { FileOperationsService } from './file-operations.service';
import { FileOperationsController } from './file-operations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileOperation } from './entities/file-operation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FileOperation])],
  controllers: [FileOperationsController],
  providers: [FileOperationsService],
})
export class FileOperationsModule {}
