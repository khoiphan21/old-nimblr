import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';
import { reject } from 'q';

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
        const queryObject: QueryObject = {
          q: query,
          p: parameters
        };
        // Enqueue task into a forever running queue
        this.enqueueQuery(queryObject);
        return resolve(true);
      } catch (error) {
        return reject(error);
      }
    });
  }

  private enqueueQuery(queryObject: QueryObject): any {
    try {
      this.queryQueue.add(() => {
        this.sendQueryToCloud(queryObject);
      }).then(() => {
        console.log('task enqueued');
      });
      return true;

    } catch (error) { throw error; }
  }

  private async sendQueryToCloud(queryObject: QueryObject): Promise<any> {
    return new Promise(async (resolve, reject) => {
      const response = await API.graphql(graphqlOperation(queryObject.q, queryObject.p));
      resolve(response);

    }).catch(err => {
      reject(err);

    });
  };


  // We probably wont need this, becoz the task queue will dequeue
  // done task automatically
  // private dequeueQuery(): any {
  //   return this.queryQueue.shift();
  // }
}
