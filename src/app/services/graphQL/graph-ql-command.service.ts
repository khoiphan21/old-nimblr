import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export abstract class GraphQlCommandService {
  abstract async query(): Promise<any>;
}

export class GraphQlCommandServiceImpl implements GraphQlCommandService {

  constructor() {
    let queryQueue = [];
  }

  /**
   * This method implements the interface GraphQlCommandService. It
   * will store queries in a temporary queue and perform them whenever 
   * possible in chronological order.
   *
   * @param query graphql query
   * @param params graphql parameters corresponding to query
   */
  async query(): Promise<any> {


    return null;
  }

  private enqueueQuery(): any {

  }

  private registerQuery(): any {

  }

  private sendQueryToCloud(): any {

  }

  private dequeueQuery(): any {

  }
}
