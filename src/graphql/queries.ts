// tslint:disable
// this is an auto generated file. This will be overwritten

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
    ownerId
    lastUpdatedBy
    sharingStatus
    title
    editorIds
    viewerIds
    blockIds
    createdAt
    updatedAt
    submissionDocIds
    recipientEmail
    submittedAt
    submissionStatus
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
      ownerId
      lastUpdatedBy
      sharingStatus
      title
      editorIds
      viewerIds
      blockIds
      createdAt
      updatedAt
      submissionDocIds
      recipientEmail
      submittedAt
      submissionStatus
    }
    nextToken
  }
}
`;
export const getBlock = `query GetBlock($id: ID!) {
  getBlock(id: $id) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    question
    answers
    questionType
    options
  }
}
`;
export const listBlocks = `query ListBlocks(
  $filter: ModelBlockFilterInput
  $limit: Int
  $nextToken: String
) {
  listBlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      version
      type
      documentId
      lastUpdatedBy
      createdAt
      updatedAt
      value
      question
      answers
      questionType
      options
    }
    nextToken
  }
}
`;
