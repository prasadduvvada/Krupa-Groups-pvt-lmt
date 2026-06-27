import { TestBed } from '@angular/core/testing';

import { RealEstate } from './real-estate';

describe('RealEstate', () => {
  let service: RealEstate;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RealEstate);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
