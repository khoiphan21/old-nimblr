import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';

export interface ListQueryResponse {
  items: Array<any>;
  nextToken: string;
  responses: Array<any>;
}

@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  constructor() { }

  async query(query, params): Promise<any> {
    try {
      return await API.graphql(graphqlOperation(query, params));
    } catch (error) {
      return Promise.reject(Error(`Failed to send query: ${error.message}`));
    }
  }

  async list({ query, queryName, params, listAll = false, limit = 10 }): Promise<ListQueryResponse> {
    const responses: Array<any> = [];
    let returnItems: Array<any>;
    params.limit = limit;
    try {
      let response: any;
      let items: any;
      let nextToken: any;
      ({ response, items, nextToken } = await this.sendQueryForListing(
        query, queryName, params
      ));
      responses.push(response);
      returnItems = items;
      if (listAll) {
        while (nextToken !== null) {
          params.nextToken = nextToken;
          ({ response, items, nextToken } = await this.sendQueryForListing(
            query, params, queryName
          ));
          responses.push(response);
          returnItems = returnItems.concat(items);
        }
      }
      return {
        items: returnItems,
        nextToken,
        responses
      };
    } catch (error) {
      throw new Error(`GraphQLService failed to list: ${error.message}`);
    }
  }

  private async sendQueryForListing(query, queryName, params): Promise<any> {
    const response: any = await API.graphql(graphqlOperation(query, params));
    const items = response.data[queryName].items;
    const nextToken = response.data[queryName].nextToken;
    return Promise.resolve({ response, items, nextToken });
  }

  getSubscription(subscription, params?): Observable<any> {
    const observable = new Subject();
    const graphqlQuery: any = API.graphql(graphqlOperation(subscription, params));
    graphqlQuery.subscribe(response => {
      observable.next(response);
    });

    return observable;
  }
}
