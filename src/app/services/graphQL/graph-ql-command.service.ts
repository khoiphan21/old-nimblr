import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';
import { reject } from 'q';

@Injectable({
  providedIn: 'root'
})

export class GraphQlCommandService {

  private queryQueue: any;

  constructor() {
    const PQueue = require('p-queue');
    const queryQueue = new PQueue({ concurrency: 1 });
  }

  /**
   * This method implements the interface GraphQlCommandService. It
   * will store queries in a temporary queue and perform them whenever 
   * possible in chronological order.
   *
   * @param query graphql query
   * @param params graphql parameters corresponding to query
   */
  async query(query: string, parameters: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const queryObject = {
          q: query,
          p: parameters
        };
        this.enqueueQuery(queryObject);

        return resolve('resolved');
      } catch (error) {

        return reject(error);
      }
    });
  }

  private async sendQueryToCloud(queryObject: object): Promise<any> {
    return new Promise((resolve, reject) => {
      //graph ql query
      // queryObject.q
      // queryObject.p
      resolve(true);
    }).catch(err => {
      reject(err);
    });
  };



  private enqueueQuery(queryObject: object): any {
    try {
      this.sendQueryToCloud(queryObject);
      this.queryQueue.add(() => {
        // blah
      });
      return true;

    } catch (error) { throw error; }
  }

  private dequeueQuery(): any {
    return this.queryQueue.shift();
  }
}
