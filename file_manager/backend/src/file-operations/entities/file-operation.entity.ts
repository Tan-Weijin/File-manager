import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ValueTransformer } from "typeorm";

const bufferTransformer: ValueTransformer = {
    to: (entityValue: Buffer) => entityValue,
    from: (databaseValue: Buffer) => Buffer.from(databaseValue),
};

@Entity()
export class FileOperation {
    // Auto-generated primary key for a file record
    @PrimaryGeneratedColumn()
    fileID: number;

    // Timestamp of when the file record was created (automatically set)
    @CreateDateColumn({ type: "timestamptz"})
    createdAt: Date;

    // Timestamp of when the file record was last updated (automatically set)
    @UpdateDateColumn({ type: "timestamptz"})
    updatedAt: Date;

    // Timestamp of when the file record was deleted (soft deletes)
    @DeleteDateColumn({ type: "timestamptz"})
    deletedAt: Date;

    // Column to store the data of the uploaded file
    @Column({ type: "bytea", transformer: bufferTransformer })
    fileData: Buffer;

    // Original file name of the uploaded file
    @Column()
    originalName: string;

    // MIME type of the file
    @Column()
    mimeType: string;
}