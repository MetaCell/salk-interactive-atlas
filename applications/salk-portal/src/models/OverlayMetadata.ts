
export default class OverlayMetadata {
    id: string;
    name: string;
    widgetId: string;

    constructor(id: string, name: string, widgetId: string) {
        this.id = id
        this.name = name
        this.widgetId = widgetId
    }
}