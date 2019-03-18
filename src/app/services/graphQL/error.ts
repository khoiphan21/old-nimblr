export class GraphQLError extends Error {
  message: string;
  query: string;
  params: any;
  backendResponse: any;
  constructor({
    message,
    query,
    params,
    backendResponse,
  }) {
    super(message);
    this.message = message;
    this.query = query;
    this.params = params;
    this.backendResponse = backendResponse;
  }
}
