import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export abstract class GraphQlCommandService {
  abstract async query(query: string, parameters: string): Promise<any>;
}

export class GraphQlCommandServiceImpl implements GraphQlCommandService {

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

        return resolve(null);
      } catch (error) {

        return reject(error);
      }
    });
  }

  private enqueueQuery(query: string, parameters: string): any {
    const queryItem = [query, parameters];
    this.queryQueue.push();
  }

  private registerQuery(): any {

  }

  private sendQueryToCloud(): any {

  }

  private dequeueQuery(): any {
    return this.queryQueue.shift();
  }
}
