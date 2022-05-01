
export default class OverlayMetadata {
    id: string;
    name: string;
    dependencies: Set<string>;

    constructor(id: string, name: string, dependencies: Set<string>) {
        this.id = id
        this.name = name
        this.dependencies = dependencies
    }
}