import { TestBed } from '@angular/core/testing';

import { BlockCommandService } from './block-command.service';
import { BlockType } from 'src/API';

const uuidv4 = require('uuid/v4');


describe('BlockCommandService', () => {
  let service: BlockCommandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(BlockCommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('[Create Block]', () => {
    fit('should ');
    it('should return an object with .subscribe() function', () => {
      // const version = uuidv4();
      fail('to be implemented');
      // const type = BlockType.TEXT;
      // const documentId = uuidv4();
      // const lastUpdatedBy = uuidv4();
      // const returnValue = service.createBlock({version, type, documentId, lastUpdatedBy});
      // console.log(typeof returnValue.subscribe)
      // expect(typeof returnValue.subscribe).toBe('function');
    });

  });

});
