import { TestBed, inject } from '@angular/core/testing';

import { IRMAService } from './irma.service';

describe('IRMAService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IRMAService]
    });
  });

  it('should be created', inject([IRMAService], (service: IRMAService) => {
    expect(service).toBeTruthy();
  }));
});
