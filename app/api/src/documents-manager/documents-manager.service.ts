import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Document, DocumentType, DocumentsRepository, ClientDocumentsRepository, User, S3Object, ClientDocument, Client } from '@cdaxfx/tools-models';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class DocumentsManagerService {
    private storage: Storage;
    private bucketName: string;
    private logger: Logger = new Logger(DocumentsManagerService.name);

    constructor(
        private readonly documentsRepository: DocumentsRepository,
        private readonly clientDocumentsRepository: ClientDocumentsRepository
    ) {
        this.storage = new Storage({
            projectId: process.env.GOOGLE_CLOUD_PROJECTID,
            credentials: {
                "client_id": "764086051850-6qr4p6gpi6hn506pt8ejuq83di341hur.apps.googleusercontent.com",
                "client_secret": "d-FL95Q19q7MQmFpd7hHD0Ty",
                "quota_project_id": "cdax-fx",
                "refresh_token": "1//0eKUxMAA7SgplCgYIARAAGA4SNwF-L9IrcQz0bh8IBWfw2KnHeUuffPNwaKIymECEgGtBm0_5VG4Eiw_NiblMnCOZUvrXtOilaAQ",
                "type": "authorized_user",
                "universe_domain": "googleapis.com"
            }
        });
        this.bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME ?? '';
    }

    async uploadImage(user: User, file: Express.Multer.File): Promise<string> {
        try {
            this.logger.log(`:: uploadImage ::`);

            const bucket = this.storage.bucket(this.bucketName);
            const fileName = `image-${user.uuid}-${Date.now()}.${file.mimetype.split('/')[1]}`;

            this.logger.log(`:: uploadImage ${file.originalname} to ${this.bucketName} ::`);

            const fileUpload = bucket.file(fileName);
            await fileUpload.save(file.buffer, {contentType: file.mimetype, public: false});

            return fileName;
        }
        catch(error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File was not uploaded.');
        }
    }

    async getDocumentFromBucket(key: string): Promise<Buffer> {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(key);

            const [fileContents] = await file.download();
            return fileContents;
        }
        catch (error) {
            throw new BadRequestException(`Failed to retrieve image from Google Cloud Storage: ${(error as any).message}`);
        }
    }

    async upload(user: User, file: Express.Multer.File): Promise<Document> {
        try {
            console.log('Upload:');

            const bucket = this.storage.bucket(this.bucketName);
            const path = `uploads/${user.username}`;
            const destinationFilename = `${path}/${Date.now()} - ${file.originalname}`;
            const fileUpload = bucket.file(destinationFilename);

            console.log(`Uploading ${file.originalname} to ${this.bucketName}...`);
            await fileUpload.save(file.buffer, {contentType: file.mimetype, public: true});
            console.log('File uploaded to Google Cloud Storage');

            const document = Document.create(file.originalname, destinationFilename, user);
            await this.documentsRepository.getEntityManager().persistAndFlush(document);
            console.log('Document saved to database');

            return document;
        }
        catch(error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File was not uploaded.');
        }
    }

    async addDocumentToClient(client: Client, type: DocumentType, document: Document): Promise<ClientDocument> {
        const exist = await this.clientDocumentsRepository.findByDocument(document);

        if (exist)
            throw new BadRequestException('Document already added.');

        try {
            if (type !== DocumentType.Other) {
                const exixtingDocumentType = await this.clientDocumentsRepository.findByDocumentType(client, type);
                if (exixtingDocumentType) {
                    await this.remove(exixtingDocumentType.document);
                    await this.removeClientDocument(exixtingDocumentType);
                }
            }

            const clientDocument = ClientDocument.create(document, client, type);

            await this.clientDocumentsRepository.getEntityManager().persistAndFlush(clientDocument);

            return clientDocument;
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('Failed to add document to client.');
        }
    }

    async finalize(document: Document, type: DocumentType): Promise<Document> {
        try {
            const newPath = `finalized/${document.creator.username} (${document.creator.uuid})/${type} - ${new Date().toISOString()} - ${document.originalFilename}`;
            const oldKey = document.ownCloudPath;
            const newKey = `${newPath}/${document.originalFilename}`;

            console.log(`Copying ${oldKey} to ${newKey} into bucket ${this.bucketName}`);

            const bucket = this.storage.bucket(this.bucketName);
            await bucket.file(oldKey).copy(bucket.file(newKey));
            console.log('File copied to new location');

            await bucket.file(oldKey).delete();
            console.log('File deleted from old location');

            document.ownCloudPath = newKey;
            await this.documentsRepository.getEntityManager().persistAndFlush(document);
            console.log('Document saved to database');

            return document;
        }
        catch(error) {
            this.logger.error(`Error finalizing document: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Document could not be finalized.');
        }
    }

    async remove(document: Document) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            await bucket.file(document.ownCloudPath).delete();
        }
        catch(error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File could not be deleted.');
        }
    }

    async removeClientDocument(clientDocument: ClientDocument) {
        try {
            await this.clientDocumentsRepository.getEntityManager().removeAndFlush(clientDocument);
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File could not be deleted from client.');
        }
    }

    async findByUuid(uuid: string): Promise<Document | null> {
        try {
            const document = await this.documentsRepository.findOne({ uuid: uuid });
            if (!document)
                throw new BadRequestException(`Document with UUID ${uuid} not found.`);
            return document;
        } 
        catch (error) {
            this.logger.error(`Error finding document by UUID: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Document not found.');
        }
    }

    async findClientDocumentByDocument(document: Document): Promise<ClientDocument | null> {
        try {
            const clientDocument = await this.clientDocumentsRepository.findByDocument(document);
            return clientDocument;
        } 
        catch (error) {
            this.logger.error(`Error finding document by UUID: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Client document not found.');
        }
    }
}