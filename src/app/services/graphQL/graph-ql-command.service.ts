import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';

interface QueryObject {
  q: string;
  p: string;
}

@Injectable({
  providedIn: 'root'
})

export class GraphQlCommandService {
  private queryQueue: any;

  constructor() {
    const PQueue = require('p-queue');
    this.queryQueue = new PQueue({ concurrency: 1 });
  }

  /**
   * This method will store queries in a temporary queue and perform them whenever 
   * possible in chronological order.
   *
   * @param query graphql query
   * @param params graphql parameters corresponding to query
   */
  async query(query: string, parameters: string): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        const queryObject: QueryObject = {
          q: query,
          p: parameters
        };
        // Enqueue task into a forever running queue
        const response = this.enqueueQuery(queryObject);
        return resolve(response);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private enqueueQuery(queryObject: QueryObject): Promise<any> {
    try {

      // Enqueue a Promise function that will perform a graphQL query.
      // After enqueuing, this promise will be returned.
      return this.queryQueue.add(() => {
        return new Promise(async (resolve, reject) => {
          try {
            const response = await API.graphql(graphqlOperation(queryObject.q, queryObject.p));
            console.log('2.0 resolve graphql api');
            resolve(response);
          } catch (error) {
            reject(error);
          }
        });
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
