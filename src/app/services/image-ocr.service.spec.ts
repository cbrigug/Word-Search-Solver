import { TestBed } from '@angular/core/testing';

import { ImageOcrService } from './image-ocr.service';

describe('ImageOcrService', () => {
  let service: ImageOcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageOcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
