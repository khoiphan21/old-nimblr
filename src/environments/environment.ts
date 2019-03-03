// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  AWS_ACCESS_KEY_ID: 'AKIAIU5JQXYYOIHRYZTQ',
  AWS_SECRET_ACCESS_KEY: 'D7nEhQvmfoIp8NNMrGWtFSJD4FoDsq2QzBkcGIvF',

  // How long should a test wait before calling an update query.
  // This variable is normally used when it's a test for subscription,// and should be modified depending on the internet speed
  WAIT_TIME_BEFORE_UPDATE: 2000,
  // Complementary timeout for tests with block update
  TIMEOUT_FOR_UPDATE_TEST: 20000
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
