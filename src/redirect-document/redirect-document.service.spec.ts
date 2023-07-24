import { Test, TestingModule } from '@nestjs/testing';
import { RedirectDocumentService } from './redirect-document.service';

describe('RedirectDocumentService', () => {
    let service: RedirectDocumentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RedirectDocumentService],
        }).compile();

        service = module.get<RedirectDocumentService>(RedirectDocumentService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
