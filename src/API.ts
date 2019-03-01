/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type CreateTextBlockInput = {
  id?: string | null,
  version: string,
  type: BlockType,
  documentId: string,
  lastUpdatedBy: string,
  value: string,
};

export enum BlockType {
  TEXT = "TEXT",
}


export type UpdateTextBlockInput = {
  id: string,
  version: string,
  type?: BlockType | null,
  documentId?: string | null,
  lastUpdatedBy: string,
  value: string,
};

export type CreateUserInput = {
  id?: string | null,
  username: string,
  email: string,
  firstName?: string | null,
  lastName?: string | null,
  documentIds?: Array< string | null > | null,
};

export type UpdateUserInput = {
  id: string,
  username?: string | null,
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
  version?: string | null,
  type: DocumentType,
  title?: string | null,
  ownerId?: string | null,
  editorIds?: Array< string | null > | null,
  viewerIds?: Array< string | null > | null,
  order?: Array< string | null > | null,
  blockIds?: Array< string | null > | null,
  lastUpdatedBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export enum DocumentType {
  GENERIC = "GENERIC",
  FORM = "FORM",
}


export type UpdateDocumentInput = {
  id: string,
  version?: string | null,
  type?: DocumentType | null,
  title?: string | null,
  ownerId?: string | null,
  editorIds?: Array< string | null > | null,
  viewerIds?: Array< string | null > | null,
  order?: Array< string | null > | null,
  blockIds?: Array< string | null > | null,
  lastUpdatedBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
};

export type DeleteDocumentInput = {
  id?: string | null,
};

export type CreateBlockInput = {
  id?: string | null,
  version?: string | null,
  type?: BlockType | null,
  documentId?: string | null,
  lastUpdatedBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  value?: string | null,
};

export type UpdateBlockInput = {
  id: string,
  version?: string | null,
  type?: BlockType | null,
  documentId?: string | null,
  lastUpdatedBy?: string | null,
  createdAt?: string | null,
  updatedAt?: string | null,
  value?: string | null,
};

export type DeleteBlockInput = {
  id?: string | null,
};

export type ModelUserFilterInput = {
  id?: ModelIDFilterInput | null,
  username?: ModelStringFilterInput | null,
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
  version?: ModelStringFilterInput | null,
  title?: ModelStringFilterInput | null,
  ownerId?: ModelStringFilterInput | null,
  editorIds?: ModelStringFilterInput | null,
  viewerIds?: ModelStringFilterInput | null,
  order?: ModelStringFilterInput | null,
  blockIds?: ModelStringFilterInput | null,
  lastUpdatedBy?: ModelStringFilterInput | null,
  createdAt?: ModelStringFilterInput | null,
  updatedAt?: ModelStringFilterInput | null,
  and?: Array< ModelDocumentFilterInput | null > | null,
  or?: Array< ModelDocumentFilterInput | null > | null,
  not?: ModelDocumentFilterInput | null,
};

export type ModelBlockFilterInput = {
  id?: ModelIDFilterInput | null,
  version?: ModelStringFilterInput | null,
  documentId?: ModelStringFilterInput | null,
  lastUpdatedBy?: ModelStringFilterInput | null,
  createdAt?: ModelStringFilterInput | null,
  updatedAt?: ModelStringFilterInput | null,
  value?: ModelStringFilterInput | null,
  and?: Array< ModelBlockFilterInput | null > | null,
  or?: Array< ModelBlockFilterInput | null > | null,
  not?: ModelBlockFilterInput | null,
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
    createdAt: string | null,
    updatedAt: string | null,
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
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type CreateUserMutationVariables = {
  input: CreateUserInput,
};

export type CreateUserMutation = {
  createUser:  {
    __typename: "User",
    id: string,
    username: string,
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
    username: string,
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
    username: string,
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
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type UpdateDocumentMutationVariables = {
  input: UpdateDocumentInput,
};

export type UpdateDocumentMutation = {
  updateDocument:  {
    __typename: "Document",
    id: string,
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type DeleteDocumentMutationVariables = {
  input: DeleteDocumentInput,
};

export type DeleteDocumentMutation = {
  deleteDocument:  {
    __typename: "Document",
    id: string,
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type CreateBlockMutationVariables = {
  input: CreateBlockInput,
};

export type CreateBlockMutation = {
  createBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type UpdateBlockMutationVariables = {
  input: UpdateBlockInput,
};

export type UpdateBlockMutation = {
  updateBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type DeleteBlockMutationVariables = {
  input: DeleteBlockInput,
};

export type DeleteBlockMutation = {
  deleteBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type GetUserQueryVariables = {
  id: string,
};

export type GetUserQuery = {
  getUser:  {
    __typename: "User",
    id: string,
    username: string,
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
      username: string,
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
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
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
      version: string | null,
      type: DocumentType,
      title: string | null,
      ownerId: string | null,
      editorIds: Array< string | null > | null,
      viewerIds: Array< string | null > | null,
      order: Array< string | null > | null,
      blockIds: Array< string | null > | null,
      lastUpdatedBy: string | null,
      createdAt: string | null,
      updatedAt: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type GetBlockQueryVariables = {
  id: string,
};

export type GetBlockQuery = {
  getBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type ListBlocksQueryVariables = {
  filter?: ModelBlockFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBlocksQuery = {
  listBlocks:  {
    __typename: "ModelBlockConnection",
    items:  Array< {
      __typename: "Block",
      id: string,
      version: string | null,
      type: BlockType | null,
      documentId: string | null,
      lastUpdatedBy: string | null,
      createdAt: string | null,
      updatedAt: string | null,
      value: string | null,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnUpdateBlockInDocumentSubscriptionVariables = {
  documentId: string,
};

export type OnUpdateBlockInDocumentSubscription = {
  onUpdateBlockInDocument:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type OnCreateUserSubscription = {
  onCreateUser:  {
    __typename: "User",
    id: string,
    username: string,
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
    username: string,
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
    username: string,
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
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type OnUpdateDocumentSubscription = {
  onUpdateDocument:  {
    __typename: "Document",
    id: string,
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type OnDeleteDocumentSubscription = {
  onDeleteDocument:  {
    __typename: "Document",
    id: string,
    version: string | null,
    type: DocumentType,
    title: string | null,
    ownerId: string | null,
    editorIds: Array< string | null > | null,
    viewerIds: Array< string | null > | null,
    order: Array< string | null > | null,
    blockIds: Array< string | null > | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
  } | null,
};

export type OnCreateBlockSubscription = {
  onCreateBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type OnUpdateBlockSubscription = {
  onUpdateBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};

export type OnDeleteBlockSubscription = {
  onDeleteBlock:  {
    __typename: "Block",
    id: string,
    version: string | null,
    type: BlockType | null,
    documentId: string | null,
    lastUpdatedBy: string | null,
    createdAt: string | null,
    updatedAt: string | null,
    value: string | null,
  } | null,
};
