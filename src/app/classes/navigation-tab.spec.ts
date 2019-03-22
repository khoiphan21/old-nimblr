import { NavigationTabHeader } from './navigation-tab';

describe('NavigationTabHeader', () => {

  describe('constructor()', () => {
    let header: NavigationTabHeader;
    const id = 'foo';
    const title = 'bar';
    beforeEach(() => {
      header = new NavigationTabHeader(id, title);
    });
    it('should store the right id', () => {
      expect(header.id).toEqual(id);
    });
    it('should store the right title', () => {
      expect(header.title).toEqual(title);
    });
  });

});
