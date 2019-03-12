import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class GraphQlCommandService {

  private queryQueue: Array<any> = [];
  constructor() { }

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

  private sendQueryToCloud(): any {

  }

  private enqueueQuery(queryObject: object): any {
    this.queryQueue.push(queryObject);
  }

  private dequeueQuery(): any {
    return this.queryQueue.shift();
  }
}
