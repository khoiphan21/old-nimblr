// tslint:disable
// this is an auto generated file. This will be overwritten

export const onUpdateBlockInDocument = `subscription OnUpdateBlockInDocument($documentId: ID!) {
  onUpdateBlockInDocument(documentId: $documentId) {
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
export const onSpecificDocumentUpdate = `subscription OnSpecificDocumentUpdate($id: ID!) {
  onSpecificDocumentUpdate(id: $id) {
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
export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const onUpdateUser = `subscription OnUpdateUser {
  onUpdateUser {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const onDeleteUser = `subscription OnDeleteUser {
  onDeleteUser {
    id
    username
    email
    firstName
    lastName
    documentIds
  }
}
`;
export const onCreateDocument = `subscription OnCreateDocument {
  onCreateDocument {
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
export const onUpdateDocument = `subscription OnUpdateDocument {
  onUpdateDocument {
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
export const onDeleteDocument = `subscription OnDeleteDocument {
  onDeleteDocument {
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
export const onCreateBlock = `subscription OnCreateBlock {
  onCreateBlock {
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
export const onUpdateBlock = `subscription OnUpdateBlock {
  onUpdateBlock {
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
export const onDeleteBlock = `subscription OnDeleteBlock {
  onDeleteBlock {
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
