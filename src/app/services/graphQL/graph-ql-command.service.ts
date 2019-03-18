import { Injectable } from '@angular/core';
import { API, graphqlOperation } from 'aws-amplify';

const PQueue = require('p-queue');

interface QueryObject {
  query: string;
  parameters: any;
}

@Injectable({
  providedIn: 'root'
})
export class GraphQlCommandService {
  private queue: any;

  constructor() {
    this.queue = new PQueue({ concurrency: 1 });
  }

  /**
   * This method will store queries in a temporary queue and perform them whenever
   * possible in chronological order.
   *
   * @param query graphql query
   * @param params graphql parameters corresponding to query
   */
  async query(query: string, parameters: any): Promise<any> {
    try {
      const queryObject: QueryObject = { query, parameters };
      // Enqueue task into a forever running queue
      const response = await this.enqueueQuery(queryObject);
      return response;
    } catch (error) {
      throw new Error(`Failed to call GraphQL Query: ${error.message}`);
    }
  }

  private async enqueueQuery(queryObject: QueryObject): Promise<any> {
    return this.queue.add(async () => {
      try {
        const response = await API.graphql(graphqlOperation(
          queryObject.query, queryObject.parameters
        ));
        return response;
      } catch (error) {
        throw new Error(`Failed to query: ${error.message}`);
      }
    });
  }

}
