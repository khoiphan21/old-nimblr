import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class GraphQLService {

  constructor() { }

  async query(query, params): Promise<any> {
    try {
      const response = await API.graphql(graphqlOperation(query, params));
      return Promise.resolve(response);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  getSubscription(subscription, params): Observable<any> {
    const observable = new Subject();
    const graphqlQuery: any = API.graphql(graphqlOperation(subscription, params));
    graphqlQuery.subscribe(response => {
      observable.next(response);
    });

    return observable;
  }
}
