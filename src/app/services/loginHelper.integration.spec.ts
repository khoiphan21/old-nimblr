import { Auth } from 'aws-amplify';
import { LoginHelper, TEST_USERNAME, TEST_PASSWORD } from './loginHelper';
import { environment } from '../../environments/environment';

describe('(Integration) LoginHelper', () => {
  beforeEach(async () => {
    await Auth.signOut();
  });

  it('should not call signIn if already logged in once', async () => {
    await LoginHelper.login();

    // Now try to login again
    const spy = spyOn(Auth, 'signIn');
    await LoginHelper.login();

    expect(spy).not.toHaveBeenCalled();
  }, environment.TIMEOUT_FOR_UPDATE_TEST);

  it('should login if currently not', async () => {
    await LoginHelper.login();

    const session = await Auth.currentSession();
    expect(session).toBeTruthy();
  }, environment.TIMEOUT_FOR_UPDATE_TEST);

  describe('createTestUser()', () => {
    it('should create a new test user', async () => {
      try {
        await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
      } catch (error) {
        // if failed to sign in, then create the user
        await LoginHelper.createTestUser();
        await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
      }
    }, environment.TIMEOUT_FOR_UPDATE_TEST);
  });

});
