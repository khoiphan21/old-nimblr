// tslint:disable
// this is an auto generated file. This will be overwritten

export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const createDocument = `mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input: $input) {
    id
    type
    title
    ownerId
    editorIds
    viewerIds
    order
    blockIds
  }
}
`;
export const updateDocument = `mutation UpdateDocument($input: UpdateDocumentInput!) {
  updateDocument(input: $input) {
    id
    type
    title
    ownerId
    editorIds
    viewerIds
    order
    blockIds
  }
}
`;
export const deleteDocument = `mutation DeleteDocument($input: DeleteDocumentInput!) {
  deleteDocument(input: $input) {
    id
    type
    title
    ownerId
    editorIds
    viewerIds
    order
    blockIds
  }
}
`;
export const createTextBlock = `mutation CreateTextBlock($input: CreateTextBlockInput!) {
  createTextBlock(input: $input) {
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
export const updateTextBlock = `mutation UpdateTextBlock($input: UpdateTextBlockInput!) {
  updateTextBlock(input: $input) {
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
export const deleteTextBlock = `mutation DeleteTextBlock($input: DeleteTextBlockInput!) {
  deleteTextBlock(input: $input) {
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
