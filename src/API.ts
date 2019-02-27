/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateUserInput = {
  id?: string | null,
  email: string,
  firstName?: string | null,
  lastName?: string | null,
  documentIds?: Array< string | null > | null,
};

export type UpdateUserInput = {
  id: string,
  email?: string | null,
  firstName?: string | null,
  lastName?: string | null,
  documentIds?: Array< string | null > | null,
};

export type DeleteUserInput = {
  id?: string | null,
};

export type CreateDocumentInput = {
  id?: string | null,
  type: DocumentType,
  title?: string | null,
  ownerId?: string | null,
  editorIds?: Array< string | null > | null,
  viewerIds?: Array< string | null > | null,
  order?: Array< string | null > | null,
  blockIds?: Array< string | null > | null,
};

export enum DocumentType {
  GENERIC = "GENERIC",
  FORM = "FORM",
}


export type UpdateDocumentInput = {
  id: string,
  type?: DocumentType | null,
  title?: string | null,
  ownerId?: string | null,
  editorIds?: Array< string | null > | null,
  viewerIds?: Array< string | null > | null,
  order?: Array< string | null > | null,
  blockIds?: Array< string | null > | null,
};

export type DeleteDocumentInput = {
  id?: string | null,
};

export type CreateTextBlockInput = {
  id?: string | null,
  version?: string | null,
  type?: BlockType | null,
  documentId?: string | null,
  lastUpdatedBy?: string | null,
  timestamp?: number | null,
  value?: string | null,
};

export enum BlockType {
  TEXT = "TEXT",
}


export type UpdateTextBlockInput = {
  id: string,
  version?: string | null,
  type?: BlockType | null,
  documentId?: string | null,
  lastUpdatedBy?: string | null,
  timestamp?: number | null,
  value?: string | null,
};

export type DeleteTextBlockInput = {
  id?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDFilterInput | null,
  email?: ModelStringFilterInput | null,
  firstName?: ModelStringFilterInput | null,
  lastName?: ModelStringFilterInput | null,
  documentIds?: ModelStringFilterInput | null,
  and?: Array< ModelUserFilterInput | null > | null,
  or?: Array< ModelUserFilterInput | null > | null,
  not?: ModelUserFilterInput | null,
};

export type ModelIDFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelStringFilterInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
};

export type ModelDocumentFilterInput = {
  id?: ModelIDFilterInput | null,
  title?: ModelStringFilterInput | null,
  ownerId?: ModelStringFilterInput | null,
  editorIds?: ModelStringFilterInput | null,
  viewerIds?: ModelStringFilterInput | null,
  order?: ModelStringFilterInput | null,
  blockIds?: ModelStringFilterInput | null,
  and?: Array< ModelDocumentFilterInput | null > | null,
  or?: Array< ModelDocumentFilterInput | null > | null,
  not?: ModelDocumentFilterInput | null,
};

export type ModelTextBlockFilterInput = {
  id?: ModelIDFilterInput | null,
  version?: ModelStringFilterInput | null,
  documentId?: ModelStringFilterInput | null,
  lastUpdatedBy?: ModelStringFilterInput | null,
  timestamp?: ModelIntFilterInput | null,
  value?: ModelStringFilterInput | null,
  and?: Array< ModelTextBlockFilterInput | null > | null,
  or?: Array< ModelTextBlockFilterInput | null > | null,
  not?: ModelTextBlockFilterInput | null,
};

export type ModelIntFilterInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  contains?: number | null,
  notContains?: number | null,
  between?: Array< number | null > | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type DeleteUserMutationVariables = {
  input: DeleteUserInput,
};

export type DeleteUserMutation = {
  deleteUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type CreateDocumentMutationVariables = {
  input: CreateDocumentInput,
};

export type CreateDocumentMutation = {
  createDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type UpdateDocumentMutationVariables = {
  input: UpdateDocumentInput,
};

export type UpdateDocumentMutation = {
  updateDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type DeleteDocumentMutationVariables = {
  input: DeleteDocumentInput,
};

export type DeleteDocumentMutation = {
  deleteDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type CreateTextBlockMutationVariables = {
  input: CreateTextBlockInput,
};

export type CreateTextBlockMutation = {
  createTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type UpdateTextBlockMutationVariables = {
  input: UpdateTextBlockInput,
};

export type UpdateTextBlockMutation = {
  updateTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type DeleteTextBlockMutationVariables = {
  input: DeleteTextBlockInput,
};

export type DeleteTextBlockMutation = {
  deleteTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type GetBlocksFromDocumentQueryVariables = {
  documentId: string,
};

export type GetBlocksFromDocumentQuery = {
  getBlocksFromDocument:  Array<( {
      __typename: "TextBlock",
      id: string,
      version: string | null,
      type: BlockType | null,
      documentId: string | null,
      lastUpdatedBy: string | null,
      timestamp: number | null,
      value: string | null,
    }
  ) | null > | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type ListUsersQueryVariables = {
  filter?: ModelUserFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListUsersQuery = {
  listUsers:  {
    __typename: "ModelUserConnection",
    items:  Array< {
      __typename: "User",
      id: string,
      email: string,
      firstName: string | null,
      lastName: string | null,
      documentIds: Array< string | null > | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetDocumentQueryVariables = {
  id: string,
};

export type GetDocumentQuery = {
  getDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type ListDocumentsQueryVariables = {
  filter?: ModelDocumentFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListDocumentsQuery = {
  listDocuments:  {
    __typename: "ModelDocumentConnection",
    items:  Array< {
      __typename: "Document",
      id: string,
      type: DocumentType,
      title: string | null,
      ownerId: string | null,
      editorIds: Array< string | null > | null,
      viewerIds: Array< string | null > | null,
      order: Array< string | null > | null,
      blockIds: Array< string | null > | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetTextBlockQueryVariables = {
  id: string,
};

export type GetTextBlockQuery = {
  getTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type ListTextBlocksQueryVariables = {
  filter?: ModelTextBlockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTextBlocksQuery = {
  listTextBlocks:  {
    __typename: "ModelTextBlockConnection",
    items:  Array< {
      __typename: "TextBlock",
      id: string,
      version: string | null,
      type: BlockType | null,
      documentId: string | null,
      lastUpdatedBy: string | null,
      timestamp: number | null,
      value: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type OnUpdateUserSubscription = {
  onUpdateUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type OnDeleteUserSubscription = {
  onDeleteUser:  {
    __typename: "User",
    id: string,
    email: string,
    firstName: string | null,
    lastName: string | null,
    documentIds: Array< string | null > | null,
  } | null,
};

export type OnCreateDocumentSubscription = {
  onCreateDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type OnUpdateDocumentSubscription = {
  onUpdateDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type OnDeleteDocumentSubscription = {
  onDeleteDocument:  {
    __typename: "Document",
    id: string,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
  } | null,
};

export type OnCreateTextBlockSubscription = {
  onCreateTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type OnUpdateTextBlockSubscription = {
  onUpdateTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};

export type OnDeleteTextBlockSubscription = {
  onDeleteTextBlock:  {
    __typename: "TextBlock",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    timestamp: number | null,
    value: string | null,
  } | null,
};
