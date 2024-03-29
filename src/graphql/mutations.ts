// tslint:disable
// this is an auto generated file. This will be overwritten

export const createTextBlock = `mutation CreateTextBlock($input: CreateTextBlockInput!) {
  createTextBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
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
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
export const createInputBlock = `mutation CreateInputBlock($input: CreateInputBlockInput!) {
  createInputBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
export const updateInputBlock = `mutation UpdateInputBlock($input: UpdateInputBlockInput!) {
  updateInputBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
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
export const updateDocument = `mutation UpdateDocument($input: UpdateDocumentInput!) {
  updateDocument(input: $input) {
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
export const deleteDocument = `mutation DeleteDocument($input: DeleteDocumentInput!) {
  deleteDocument(input: $input) {
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
export const createBlock = `mutation CreateBlock($input: CreateBlockInput!) {
  createBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
export const updateBlock = `mutation UpdateBlock($input: UpdateBlockInput!) {
  updateBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
export const deleteBlock = `mutation DeleteBlock($input: DeleteBlockInput!) {
  deleteBlock(input: $input) {
    id
    version
    type
    documentId
    lastUpdatedBy
    createdAt
    updatedAt
    value
    textBlockType
    answers
    inputType
    options
    isLocked
  }
}
`;
