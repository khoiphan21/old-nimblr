import { GraphQLError } from './error';

describe('GraphQLError', () => {
  let error: GraphQLError;
  let params: any;

  beforeEach(() => {
    params = {
      message: 'test message',
      query: 'test query',
      params: { value: 'test' },
      backendResponse: 'test backend message'
    };
    error = new GraphQLError(params);
  });

  it('should store the message', () => {
    expect(error.message).toEqual(params.message);
  });
  it('should store the query', () => {
    expect(error.query).toEqual(params.query);
  });
  it('should store the params', () => {
    expect(error.params).toEqual(params.params);
  });
  it('should store the backendMessage', () => {
    expect(error.backendResponse).toEqual(params.backendResponse);
  });
});
