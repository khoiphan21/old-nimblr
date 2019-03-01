// tslint:disable
// this is an auto generated file. This will be overwritten

export const getBlocksFromDocument = `query GetBlocksFromDocument($documentId: ID!) {
  getBlocksFromDocument(documentId: $documentId) {
    id
    version
    type
    documentId
    lastUpdatedBy
    timestamp
    ... on TextBlock {
      value
    }
  }
}
`;
export const getUser = `query GetUser($id: ID!) {
  getUser(id: $id) {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const listUsers = `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      username
      email
      firstName
      lastName
      documentIds
    }
    nextToken
  }
}
`;
export const getDocument = `query GetDocument($id: ID!) {
  getDocument(id: $id) {
    id
    version
    type
    title
    ownerId
    editorIds
    viewerIds
    order
    blockIds
    lastUpdatedBy
    timestamp
  }
}
`;
export const listDocuments = `query ListDocuments(
  $filter: ModelDocumentFilterInput
  $limit: Int
  $nextToken: String
) {
  listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      version
      type
      title
      ownerId
      editorIds
      viewerIds
      order
      blockIds
      lastUpdatedBy
      timestamp
    }
    nextToken
  }
}
`;
export const getTextBlock = `query GetTextBlock($id: ID!) {
  getTextBlock(id: $id) {
    id
    version
    type
    documentId
    lastUpdatedBy
    timestamp
    value
  }
}
`;
export const listTextBlocks = `query ListTextBlocks(
  $filter: ModelTextBlockFilterInput
  $limit: Int
  $nextToken: String
) {
  listTextBlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      version
      type
      documentId
      lastUpdatedBy
      timestamp
      value
    }
    nextToken
  }
}
`;
