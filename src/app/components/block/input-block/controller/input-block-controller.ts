import { InputBlock } from '../../../../classes/block/input-block';
import { Observable, BehaviorSubject } from 'rxjs';
/**
 * Tasks needs to be handled by this class:
 * - manage any changes to the properties of the given input block
 * - let the child update backend for any changes by user
 * - update the child with any changes caused by another browser
 *
 */
export class InputBlockController {

  private inputBlock$: BehaviorSubject<InputBlock>;

  setInputBlock(block: InputBlock) {

  }

  getInputBlock$(): Observable<InputBlock> {
    return;
  }

}
