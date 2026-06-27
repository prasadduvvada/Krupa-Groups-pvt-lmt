import { TestBed } from '@angular/core/testing';

import { Furniture } from './furniture';

describe('Furniture', () => {
  let service: Furniture;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Furniture);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
