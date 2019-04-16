import { Auth } from 'aws-amplify';
import { LoginHelper } from './loginHelper';

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
  });

  it('should login if currently not', async () => {
    await LoginHelper.login();

    const session = await Auth.currentSession();
    expect(session).toBeTruthy();
  });
});
