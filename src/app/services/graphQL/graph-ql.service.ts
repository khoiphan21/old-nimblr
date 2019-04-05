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

  /**
   * Send the given query to the backend API and return the raw response
   * of the query
   *
   * @param query the query to be sent
   * @param params the parameters of the query
   */
  async query(query: string, params: any): Promise<any> {
    try {
      return await API.graphql(graphqlOperation(query, params));
    } catch (error) {
      const message = error.errors[0].message;
      console.error(`Query failed: `, query);
      console.error('Query failed with params: ', params);
      return Promise.reject(Error(`[GraphQLService] Failed to send query: ${message}`));
    }
  }

  /**
   * Query for a list of items, by default will not try to list all items, and
   * the default limit of items returned per query is 10.
   *
   * Returns the list of items with some additional info for debugging
   *
   * @param param0 parameters for the query
   */
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
            query, queryName, params
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
      const message = error.errors[0].message;
      throw new Error(`GraphQLService failed to list: ${message}`);
    }
  }

  private async sendQueryForListing(
    query: string, queryName: string, params: any
  ): Promise<any> {
    const response: any = await API.graphql(graphqlOperation(query, params));
    const items = response.data[queryName].items;
    const nextToken = response.data[queryName].nextToken;
    return Promise.resolve({ response, items, nextToken });
  }

  /**
   * Get the subscription from the backend
   *
   * @param subscription the type of subscription to get
   * @param params parameters for the query
   */
  getSubscription(subscription: string, params?: any): Observable<any> {
    const observable = new Subject();
    const graphqlQuery: any = API.graphql(graphqlOperation(subscription, params));

    graphqlQuery.subscribe((response: any) => {
      observable.next(response);
    }, error => {
      const message = error.errors[0].message;
      const newError = Error(`GraphQLService failed to subscribe: ${message}`);
      observable.error(newError);
    });

    return observable;
  }
}
