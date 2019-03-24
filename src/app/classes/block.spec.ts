import { BlockCreateError } from './block';
import { BlockType } from 'src/API';


describe('BlockCreateError', () => {
  it('should create error with the extra params', () => {
    const type = BlockType.TEXT;
    const message = 'error message';
    const newError = new BlockCreateError(type, message);
    expect(newError.message).toEqual(message);
  });
});
