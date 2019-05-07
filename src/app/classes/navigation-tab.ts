import { UUID } from '../services/document/command/document-command.service';
import { DocumentType } from '../../API';
interface NavigationTab {
    id: string;
    title: string;
}

export interface CreateNavigationTabInput {
    id: UUID;
    title: string;
    type: DocumentType;
    children: Array<NavigationTabHeader>;
}

export class NavigationTabDocument implements NavigationTab {
    id: UUID;
    title: string;
    type: DocumentType;
    children: Array<NavigationTabHeader>;
    constructor(input: CreateNavigationTabInput) {
        this.id = input.id;
        this.title = input.title;
        this.type = input.type;
        this.children = input.children;
    }
}

export class NavigationTabHeader implements NavigationTab {
    id: string;
    title: string;
    constructor(
        id: string,
        title: string,
    ) {
        this.id = id;
        this.title = title;
    }
}


