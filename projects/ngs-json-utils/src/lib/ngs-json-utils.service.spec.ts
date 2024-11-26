import { TestBed } from '@angular/core/testing';

import { NgsJsonUtilsService } from './ngs-json-utils.service';

describe('NgsJsonUtilsService', () => {
  let service: NgsJsonUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgsJsonUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
