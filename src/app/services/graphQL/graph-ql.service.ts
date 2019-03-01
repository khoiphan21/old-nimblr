import { Injectable } from '@angular/core';
import { Auth, API, graphqlOperation } from 'aws-amplify';
import { Observable } from 'rxjs';


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

  subscribe(subscription): Observable<any> {
    return;
  }
}
