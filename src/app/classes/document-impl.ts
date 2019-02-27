import { Document, DocumentType } from './document';
import { User } from './user';

export class DocumentImpl implements Document {
    id: string;
    type: DocumentType;
    title: string;
    owner: User;
    editors: Array<User>;
    viewers: Array<User>;
    order: Array<string>;

    constructor(
        id: string,
        type: DocumentType,
        title: string,
        owner: User,
        editors: Array<User>,
        viewers: Array<User>,
        order: Array<string>
    ) {
        this.id = id;
        this.type = type;
        this.title = title;
        this.owner = owner;
        this.editors = editors;
        this.viewers = viewers;
        this.order = order;
    }
}
