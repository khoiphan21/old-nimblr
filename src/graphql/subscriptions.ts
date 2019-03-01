// tslint:disable
// this is an auto generated file. This will be overwritten

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
export const onUpdateDocument = `subscription OnUpdateDocument {
  onUpdateDocument {
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
export const onDeleteDocument = `subscription OnDeleteDocument {
  onDeleteDocument {
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
export const onCreateTextBlock = `subscription OnCreateTextBlock {
  onCreateTextBlock {
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
export const onUpdateTextBlock = `subscription OnUpdateTextBlock {
  onUpdateTextBlock {
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
export const onDeleteTextBlock = `subscription OnDeleteTextBlock {
  onDeleteTextBlock {
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
