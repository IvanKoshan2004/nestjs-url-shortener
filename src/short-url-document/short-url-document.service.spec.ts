import { Test, TestingModule } from '@nestjs/testing';
import { ShortUrlDocumentService } from './short-url-document.service';

describe('ShortUrlDocumentService', () => {
    let service: ShortUrlDocumentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ShortUrlDocumentService],
        }).compile();

        service = module.get<ShortUrlDocumentService>(ShortUrlDocumentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
