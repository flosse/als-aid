import { Injectable } from "@angular/core";

@Injectable()
export class UUID {

    private id: string;
    private generated: boolean = false;

    constructor() {}

    setId(id) {
        this.generated = true;
        this.id = id;
    }

    getId(): string {
        return this.id;
    }

    isGenerated(): boolean {
        return this.generated;
    }
}
