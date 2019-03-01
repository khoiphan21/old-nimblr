interface NavigationTab {
    id: string;
    title: string;
}

export class NavigationTabDocument implements NavigationTab {
    id: string;
    title: string;
    children: Array<NavigationTabHeader>;
    constructor(
        id: string,
        title: string,
        children: Array<NavigationTabHeader>
    ) {
        this.id = id;
        this.title = title;
        this.children = children;
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


