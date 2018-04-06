import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';


import { IRMAService } from './irma.service';

describe('IRMAService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IRMAService],
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', inject([IRMAService], (service: IRMAService) => {
    expect(service).toBeTruthy();
  }));
});
