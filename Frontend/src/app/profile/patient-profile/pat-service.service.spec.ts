import { TestBed } from '@angular/core/testing';

import { PatService } from './pat-service.service';

describe('PatServiceService', () => {
  let service: PatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
