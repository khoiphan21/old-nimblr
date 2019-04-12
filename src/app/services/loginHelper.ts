import { Auth } from 'aws-amplify';
import { TEST_USERNAME, TEST_PASSWORD } from './account/account-impl.service.spec';

export class LoginHelper {
  /**
   * Will login if not already done so, and return the current session
   */
  static async login(): Promise<any> {
    try {
      // Try to get the session
      return await Auth.currentSession();
    } catch (error) {
      // Failed. Now login and return the new session
      await Auth.signIn(TEST_USERNAME, TEST_PASSWORD);
      return await Auth.currentSession();
    }
  }
}
