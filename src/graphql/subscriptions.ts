// tslint:disable
// this is an auto generated file. This will be overwritten

export const onCreateUser = `subscription OnCreateUser {
  onCreateUser {
    id
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
export const onUpdateDocument = `subscription OnUpdateDocument {
  onUpdateDocument {
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
export const onDeleteDocument = `subscription OnDeleteDocument {
  onDeleteDocument {
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
