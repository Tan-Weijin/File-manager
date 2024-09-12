import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileOperationsModule } from './file-operations/file-operations.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [FileOperationsModule,
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "postgres",
      password: "test",
      database: "postgres",
      entities: ["dist/**/*.entity.js"],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
