import { TestBed } from '@angular/core/testing';

import { CommandService } from './command.service';
import { configureTestSuite } from 'ng-bullet';
import { AccountService } from '../account/account.service';
import { MockAccountService } from '../account/account-impl.service.spec';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { uuidv4 } from '../../classes/uuidv4';
import { CommandType } from '../../classes/command/commandType';
import { SendDocumentCommand } from 'src/app/classes/command/sendDocument/sendDocumentCommand';
import { UpdateBlockCommand } from '../../classes/command/updateBlock/updateBlockCommand';

// tslint:disable:no-string-literal
describe('CommandService', () => {
  let service: CommandService;

  const id = uuidv4();

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: MockAccountService
        },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: new BehaviorSubject({
              get: () => id
            })
          }
        },
        {
          provide: Router,
          useValue: {
            url: '/document'
          }
        }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(CommandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor()', () => {
    it('should setup a new commandMap with no stored objects', () => {
      expect(service['commandMap'].size).toBe(0);
    });
  });

  describe('getCommand()', () => {
    let createSpy: jasmine.Spy;
    const type = CommandType.SEND_DOCUMENT;

    beforeEach(() => {
      createSpy = spyOn<any>(service, 'createCommand');
    });

    it('should call to create a command if not exists', () => {
      service.getCommand(type);
      expect(createSpy).toHaveBeenCalledWith(type);
    });

    it('should not call to create if a command exists', () => {
      const mockCommand: any = { foo: 'bar' };
      service['commandMap'].set(type, mockCommand);
      service.getCommand(type);
      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  describe('createCommand()', () => {
    it('SEND_DOCUMENT - should create a valid SendDocumentCommand', () => {
      const type = CommandType.SEND_DOCUMENT;
      service['createCommand'](CommandType.SEND_DOCUMENT);
      expect(service.getCommand(type) instanceof SendDocumentCommand).toBeTruthy();
    });

    it('UPDATE_BLOCK - should create a valid UpdateBlockCommand', () => {
      const type = CommandType.UPDATE_BLOCK;
      service['createCommand'](CommandType.UPDATE_BLOCK);
      expect(service.getCommand(type) instanceof UpdateBlockCommand).toBeTruthy();
    });

    describe('unknown CommandType', () => {
      it('should throw an error', () => {
        const type: any = 'abcd';
        try {
          service['createCommand'](type);
          fail('error must occur');
        } catch (error) {
          const message = 'CommandService failed to getCommand: unknown CommandType';
          expect(error.message).toEqual(message);
        }
      });
    });
  });
});
