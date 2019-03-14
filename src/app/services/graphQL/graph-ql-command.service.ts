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
        const result: boolean = this.enqueueQuery(queryObject);
        return resolve(result);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private enqueueQuery(queryObject: QueryObject): boolean {
    try {
      this.queryQueue.add(() => {
        // add a funciton into task queue, so it will be executed automatically
        return new Promise(async (resolve, _) => {
          const response = await API.graphql(graphqlOperation(queryObject.q, queryObject.p));
          resolve(response);
        });
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // We probably wont need this, becoz the task queue will dequeue
  // done task automatically
  // private dequeueQuery(): any {
  //   return this.queryQueue.shift();
  // }
}
