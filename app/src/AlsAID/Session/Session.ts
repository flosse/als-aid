import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";

import { UserInterface } from "../Interfaces/UserInterface";

@Injectable()
export class Session {

    protected user: UserInterface = {
        email: "",
        avatar: ""
    };

    constructor(
        public events: Events
    ) { }

    initialize(user: UserInterface): void {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    get(attr: string): string {
        return this.user[attr];
    }
}
