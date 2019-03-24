/* tslint:disable */
//  This file was automatically generated and should not be edited.
import { Injectable } from "@angular/core";
import API, { graphqlOperation } from "@aws-amplify/api";
import { GraphQLResult } from "@aws-amplify/api/lib/types";
import * as Observable from "zen-observable";

export type CreateTextBlockInput = {
  id?: string | null;
  version: string;
  type: BlockType;
  documentId: string;
  lastUpdatedBy: string;
  value?: string | null;
};

export enum BlockType {
  TEXT = "TEXT"
}

export type UpdateTextBlockInput = {
  id: string;
  version: string;
  type?: BlockType | null;
  documentId?: string | null;
  lastUpdatedBy: string;
  updatedAt: string;
  value?: string | null;
};

export type CreateUserInput = {
  id?: string | null;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  documentIds?: Array<string | null> | null;
};

export type UpdateUserInput = {
  id: string;
  username?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  documentIds?: Array<string | null> | null;
};

export type DeleteUserInput = {
  id?: string | null;
};

export type CreateDocumentInput = {
  id?: string | null;
  version?: string | null;
  type: DocumentType;
  title?: string | null;
  ownerId?: string | null;
  editorIds?: Array<string | null> | null;
  viewerIds?: Array<string | null> | null;
  order?: Array<string | null> | null;
  blockIds?: Array<string | null> | null;
  lastUpdatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export enum DocumentType {
  GENERIC = "GENERIC",
  FORM = "FORM"
}

export type UpdateDocumentInput = {
  id: string;
  version?: string | null;
  type?: DocumentType | null;
  title?: string | null;
  ownerId?: string | null;
  editorIds?: Array<string | null> | null;
  viewerIds?: Array<string | null> | null;
  order?: Array<string | null> | null;
  blockIds?: Array<string | null> | null;
  lastUpdatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type DeleteDocumentInput = {
  id?: string | null;
};

export type CreateBlockInput = {
  id?: string | null;
  version?: string | null;
  type?: BlockType | null;
  documentId?: string | null;
  lastUpdatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  value?: string | null;
};

export type UpdateBlockInput = {
  id: string;
  version?: string | null;
  type?: BlockType | null;
  documentId?: string | null;
  lastUpdatedBy?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  value?: string | null;
};

export type DeleteBlockInput = {
  id?: string | null;
};

export type ModelUserFilterInput = {
  id?: ModelIDFilterInput | null;
  username?: ModelStringFilterInput | null;
  email?: ModelStringFilterInput | null;
  firstName?: ModelStringFilterInput | null;
  lastName?: ModelStringFilterInput | null;
  documentIds?: ModelStringFilterInput | null;
  and?: Array<ModelUserFilterInput | null> | null;
  or?: Array<ModelUserFilterInput | null> | null;
  not?: ModelUserFilterInput | null;
};

export type ModelIDFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelStringFilterInput = {
  ne?: string | null;
  eq?: string | null;
  le?: string | null;
  lt?: string | null;
  ge?: string | null;
  gt?: string | null;
  contains?: string | null;
  notContains?: string | null;
  between?: Array<string | null> | null;
  beginsWith?: string | null;
};

export type ModelDocumentFilterInput = {
  id?: ModelIDFilterInput | null;
  version?: ModelStringFilterInput | null;
  type?: ModelDocumentTypeFilterInput | null;
  title?: ModelStringFilterInput | null;
  ownerId?: ModelStringFilterInput | null;
  editorIds?: ModelStringFilterInput | null;
  viewerIds?: ModelStringFilterInput | null;
  order?: ModelStringFilterInput | null;
  blockIds?: ModelStringFilterInput | null;
  lastUpdatedBy?: ModelStringFilterInput | null;
  createdAt?: ModelStringFilterInput | null;
  updatedAt?: ModelStringFilterInput | null;
  and?: Array<ModelDocumentFilterInput | null> | null;
  or?: Array<ModelDocumentFilterInput | null> | null;
  not?: ModelDocumentFilterInput | null;
};

export type ModelDocumentTypeFilterInput = {
  eq?: DocumentType | null;
  ne?: DocumentType | null;
};

export type ModelBlockFilterInput = {
  id?: ModelIDFilterInput | null;
  version?: ModelStringFilterInput | null;
  type?: ModelBlockTypeFilterInput | null;
  documentId?: ModelStringFilterInput | null;
  lastUpdatedBy?: ModelStringFilterInput | null;
  createdAt?: ModelStringFilterInput | null;
  updatedAt?: ModelStringFilterInput | null;
  value?: ModelStringFilterInput | null;
  and?: Array<ModelBlockFilterInput | null> | null;
  or?: Array<ModelBlockFilterInput | null> | null;
  not?: ModelBlockFilterInput | null;
};

export type ModelBlockTypeFilterInput = {
  eq?: BlockType | null;
  ne?: BlockType | null;
};

export type CreateTextBlockMutation = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type UpdateTextBlockMutation = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type CreateUserMutation = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type UpdateUserMutation = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type DeleteUserMutation = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type CreateDocumentMutation = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UpdateDocumentMutation = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type DeleteDocumentMutation = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type CreateBlockMutation = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type UpdateBlockMutation = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type DeleteBlockMutation = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type GetUserQuery = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type ListUsersQuery = {
  __typename: "ModelUserConnection";
  items: Array<{
    __typename: "User";
    id: string;
    username: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
    documentIds: Array<string | null> | null;
  } | null> | null;
  nextToken: string | null;
};

export type GetDocumentQuery = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type ListDocumentsQuery = {
  __typename: "ModelDocumentConnection";
  items: Array<{
    __typename: "Document";
    id: string;
    version: string | null;
    type: DocumentType;
    title: string | null;
    ownerId: string | null;
    editorIds: Array<string | null> | null;
    viewerIds: Array<string | null> | null;
    order: Array<string | null> | null;
    blockIds: Array<string | null> | null;
    lastUpdatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  } | null> | null;
  nextToken: string | null;
};

export type GetBlockQuery = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type ListBlocksQuery = {
  __typename: "ModelBlockConnection";
  items: Array<{
    __typename: "Block";
    id: string;
    version: string | null;
    type: BlockType | null;
    documentId: string | null;
    lastUpdatedBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    value: string | null;
  } | null> | null;
  nextToken: string | null;
};

export type OnUpdateBlockInDocumentSubscription = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type OnSpecificDocumentUpdateSubscription = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OnCreateUserSubscription = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type OnUpdateUserSubscription = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type OnDeleteUserSubscription = {
  __typename: "User";
  id: string;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  documentIds: Array<string | null> | null;
};

export type OnCreateDocumentSubscription = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OnUpdateDocumentSubscription = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OnDeleteDocumentSubscription = {
  __typename: "Document";
  id: string;
  version: string | null;
  type: DocumentType;
  title: string | null;
  ownerId: string | null;
  editorIds: Array<string | null> | null;
  viewerIds: Array<string | null> | null;
  order: Array<string | null> | null;
  blockIds: Array<string | null> | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type OnCreateBlockSubscription = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type OnUpdateBlockSubscription = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

export type OnDeleteBlockSubscription = {
  __typename: "Block";
  id: string;
  version: string | null;
  type: BlockType | null;
  documentId: string | null;
  lastUpdatedBy: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  value: string | null;
};

@Injectable({
  providedIn: "root"
})
export class APIService {
  async CreateTextBlock(
    input: CreateTextBlockInput
  ): Promise<CreateTextBlockMutation> {
    const statement = `mutation CreateTextBlock($input: CreateTextBlockInput!) {
        createTextBlock(input: $input) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateTextBlockMutation>response.data.createTextBlock;
  }
  async UpdateTextBlock(
    input: UpdateTextBlockInput
  ): Promise<UpdateTextBlockMutation> {
    const statement = `mutation UpdateTextBlock($input: UpdateTextBlockInput!) {
        updateTextBlock(input: $input) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateTextBlockMutation>response.data.updateTextBlock;
  }
  async CreateUser(input: CreateUserInput): Promise<CreateUserMutation> {
    const statement = `mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateUserMutation>response.data.createUser;
  }
  async UpdateUser(input: UpdateUserInput): Promise<UpdateUserMutation> {
    const statement = `mutation UpdateUser($input: UpdateUserInput!) {
        updateUser(input: $input) {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateUserMutation>response.data.updateUser;
  }
  async DeleteUser(input: DeleteUserInput): Promise<DeleteUserMutation> {
    const statement = `mutation DeleteUser($input: DeleteUserInput!) {
        deleteUser(input: $input) {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteUserMutation>response.data.deleteUser;
  }
  async CreateDocument(
    input: CreateDocumentInput
  ): Promise<CreateDocumentMutation> {
    const statement = `mutation CreateDocument($input: CreateDocumentInput!) {
        createDocument(input: $input) {
          __typename
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateDocumentMutation>response.data.createDocument;
  }
  async UpdateDocument(
    input: UpdateDocumentInput
  ): Promise<UpdateDocumentMutation> {
    const statement = `mutation UpdateDocument($input: UpdateDocumentInput!) {
        updateDocument(input: $input) {
          __typename
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateDocumentMutation>response.data.updateDocument;
  }
  async DeleteDocument(
    input: DeleteDocumentInput
  ): Promise<DeleteDocumentMutation> {
    const statement = `mutation DeleteDocument($input: DeleteDocumentInput!) {
        deleteDocument(input: $input) {
          __typename
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteDocumentMutation>response.data.deleteDocument;
  }
  async CreateBlock(input: CreateBlockInput): Promise<CreateBlockMutation> {
    const statement = `mutation CreateBlock($input: CreateBlockInput!) {
        createBlock(input: $input) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <CreateBlockMutation>response.data.createBlock;
  }
  async UpdateBlock(input: UpdateBlockInput): Promise<UpdateBlockMutation> {
    const statement = `mutation UpdateBlock($input: UpdateBlockInput!) {
        updateBlock(input: $input) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <UpdateBlockMutation>response.data.updateBlock;
  }
  async DeleteBlock(input: DeleteBlockInput): Promise<DeleteBlockMutation> {
    const statement = `mutation DeleteBlock($input: DeleteBlockInput!) {
        deleteBlock(input: $input) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      input
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <DeleteBlockMutation>response.data.deleteBlock;
  }
  async GetUser(id: string): Promise<GetUserQuery> {
    const statement = `query GetUser($id: ID!) {
        getUser(id: $id) {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetUserQuery>response.data.getUser;
  }
  async ListUsers(
    filter?: ModelUserFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListUsersQuery> {
    const statement = `query ListUsers($filter: ModelUserFilterInput, $limit: Int, $nextToken: String) {
        listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            username
            email
            firstName
            lastName
            documentIds
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListUsersQuery>response.data.listUsers;
  }
  async GetDocument(id: string): Promise<GetDocumentQuery> {
    const statement = `query GetDocument($id: ID!) {
        getDocument(id: $id) {
          __typename
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
          createdAt
          updatedAt
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetDocumentQuery>response.data.getDocument;
  }
  async ListDocuments(
    filter?: ModelDocumentFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListDocumentsQuery> {
    const statement = `query ListDocuments($filter: ModelDocumentFilterInput, $limit: Int, $nextToken: String) {
        listDocuments(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
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
            createdAt
            updatedAt
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListDocumentsQuery>response.data.listDocuments;
  }
  async GetBlock(id: string): Promise<GetBlockQuery> {
    const statement = `query GetBlock($id: ID!) {
        getBlock(id: $id) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`;
    const gqlAPIServiceArguments: any = {
      id
    };
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <GetBlockQuery>response.data.getBlock;
  }
  async ListBlocks(
    filter?: ModelBlockFilterInput,
    limit?: number,
    nextToken?: string
  ): Promise<ListBlocksQuery> {
    const statement = `query ListBlocks($filter: ModelBlockFilterInput, $limit: Int, $nextToken: String) {
        listBlocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
          __typename
          items {
            __typename
            id
            version
            type
            documentId
            lastUpdatedBy
            createdAt
            updatedAt
            value
          }
          nextToken
        }
      }`;
    const gqlAPIServiceArguments: any = {};
    if (filter) {
      gqlAPIServiceArguments.filter = filter;
    }
    if (limit) {
      gqlAPIServiceArguments.limit = limit;
    }
    if (nextToken) {
      gqlAPIServiceArguments.nextToken = nextToken;
    }
    const response = (await API.graphql(
      graphqlOperation(statement, gqlAPIServiceArguments)
    )) as any;
    return <ListBlocksQuery>response.data.listBlocks;
  }
  OnUpdateBlockInDocumentListener: Observable<
    OnUpdateBlockInDocumentSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateBlockInDocument($documentId: ID!) {
        onUpdateBlockInDocument(documentId: $documentId) {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`
    )
  ) as Observable<OnUpdateBlockInDocumentSubscription>;

  OnSpecificDocumentUpdateListener: Observable<
    OnSpecificDocumentUpdateSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnSpecificDocumentUpdate($id: ID!) {
        onSpecificDocumentUpdate(id: $id) {
          __typename
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
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnSpecificDocumentUpdateSubscription>;

  OnCreateUserListener: Observable<OnCreateUserSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnCreateUser {
        onCreateUser {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`
    )
  ) as Observable<OnCreateUserSubscription>;

  OnUpdateUserListener: Observable<OnUpdateUserSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnUpdateUser {
        onUpdateUser {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`
    )
  ) as Observable<OnUpdateUserSubscription>;

  OnDeleteUserListener: Observable<OnDeleteUserSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnDeleteUser {
        onDeleteUser {
          __typename
          id
          username
          email
          firstName
          lastName
          documentIds
        }
      }`
    )
  ) as Observable<OnDeleteUserSubscription>;

  OnCreateDocumentListener: Observable<
    OnCreateDocumentSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnCreateDocument {
        onCreateDocument {
          __typename
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
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnCreateDocumentSubscription>;

  OnUpdateDocumentListener: Observable<
    OnUpdateDocumentSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnUpdateDocument {
        onUpdateDocument {
          __typename
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
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnUpdateDocumentSubscription>;

  OnDeleteDocumentListener: Observable<
    OnDeleteDocumentSubscription
  > = API.graphql(
    graphqlOperation(
      `subscription OnDeleteDocument {
        onDeleteDocument {
          __typename
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
          createdAt
          updatedAt
        }
      }`
    )
  ) as Observable<OnDeleteDocumentSubscription>;

  OnCreateBlockListener: Observable<OnCreateBlockSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnCreateBlock {
        onCreateBlock {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`
    )
  ) as Observable<OnCreateBlockSubscription>;

  OnUpdateBlockListener: Observable<OnUpdateBlockSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnUpdateBlock {
        onUpdateBlock {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`
    )
  ) as Observable<OnUpdateBlockSubscription>;

  OnDeleteBlockListener: Observable<OnDeleteBlockSubscription> = API.graphql(
    graphqlOperation(
      `subscription OnDeleteBlock {
        onDeleteBlock {
          __typename
          id
          version
          type
          documentId
          lastUpdatedBy
          createdAt
          updatedAt
          value
        }
      }`
    )
  ) as Observable<OnDeleteBlockSubscription>;
}
