import { Injectable } from '@angular/core';

@Injectable()
export class Config {

    private config: any = {
        version: "0.0.2",
        endpoint: "https://endpoint.als-aid.org"
    };

    constructor() { }

    get(key: string): any {
        if (this.config.hasOwnProperty(key) === false) {
            throw new Error("Invalid config key.");
        }

        return this.config[key];
    }

    getEndpoint(path: string): string {
        return `${this.get("endpoint")}/${path}`;
    }

}
