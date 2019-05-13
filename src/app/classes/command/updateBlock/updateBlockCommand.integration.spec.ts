import { TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { UpdateBlockCommand } from './updateBlockCommand';
import { BlockCommandService } from '../../../services/block/command/block-command.service';
import { AccountService } from '../../../services/account/account.service';
import { AccountServiceImpl } from '../../../services/account/account-impl.service';
import { VersionService } from '../../../services/version/version.service';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginHelper } from '../../../services/loginHelper';
import { uuidv4 } from '../../uuidv4';
import { BlockType, CreateTextBlockInput } from '../../../../API';
import { BlockQueryService } from '../../../services/block/query/block-query.service';
import { TextBlock } from '../../block/textBlock';

describe('(Integration) UpdateBlockCommand', () => {
  let command: UpdateBlockCommand;
  let blockCommandService: BlockCommandService;
  let blockQueryService: BlockQueryService;
  let versionService: VersionService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: AccountService,
          useClass: AccountServiceImpl
        }
      ],
      imports: [
        RouterTestingModule
      ]
    });
  });

  beforeEach(async () => {
    await LoginHelper.login();

    command = new UpdateBlockCommand({
      blockCommandService: TestBed.get(BlockCommandService),
      accountService: TestBed.get(AccountService),
      versionService: TestBed.get(VersionService)
    });

    blockCommandService = TestBed.get(BlockCommandService);
    blockQueryService = TestBed.get(BlockQueryService);
    versionService = TestBed.get(VersionService);
  });

  it('should update a block successfully', async () => {
    // create a block
    const input: CreateTextBlockInput = {
      id: uuidv4(),
      version: uuidv4(),
      type: BlockType.TEXT,
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4(),
      value: 'test'
    };
    await blockCommandService.createBlock(input);

    // update it
    await command.update({
      id: input.id,
      type: BlockType.TEXT,
      value: 'new'
    });

    // retrieve and check the block
    const block = await getFirstBlock(input.id);
    expect(block.value).toEqual('new');
    // check that the version is registerd
    expect(versionService.isRegistered(block.version)).toBeTruthy();

    async function getFirstBlock(id): Promise<TextBlock> {
      return new Promise(resolve => {
        blockQueryService.getBlock$(id).subscribe((retrievedBlock: TextBlock) => {
          if (retrievedBlock !== null) { resolve(retrievedBlock); }
        });
      });
    }
  });
});
