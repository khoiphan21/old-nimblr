import { InputBlockController } from './input-block-controller';
import { InputBlock } from '../../../../classes/block/input-block';
import { BlockFactoryService } from '../../../../services/block/factory/block-factory.service';
import { configureTestSuite } from 'ng-bullet';
import { TestBed } from '@angular/core/testing';
import { uuidv4 } from '../../../../classes/uuidv4';
import { CommandService } from '../../../../services/command/command.service';

fdescribe('InputBlockController', () => {
  let controller: InputBlockController;

  let blockFactory: BlockFactoryService;
  let commandService: CommandService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(() => {
    blockFactory = TestBed.get(BlockFactoryService);
    commandService = TestBed.get(CommandService);
    controller = new InputBlockController(commandService);
  });

  it('should set and get the given input block', () => {
    const inputBlock: InputBlock = blockFactory.createNewInputBlock({
      documentId: uuidv4(),
      lastUpdatedBy: uuidv4()
    });

    controller.setInputBlock(inputBlock);
    expect(controller.getInputBlock$().value).toEqual(inputBlock);
  });
});
