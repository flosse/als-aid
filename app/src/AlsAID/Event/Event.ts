import { Injectable } from '@angular/core';

import { Events } from "ionic-angular";

@Injectable()
export class Event {

    private subscribed = {};

    constructor(
        public events: Events
    ) { }

    /**
     * Subscribes to an event only once. (singleton event) Subsequent calls will be ignored.
     * @param {string} event    [description]
     * @param {any}    callback [description]
     */
    subscribeOnce(event: string, callback: any): any {

        if (this.subscribed.hasOwnProperty(event) === true) {
            return;
        }

        this.subscribed[event] = callback;
        return this.events.subscribe(event, callback);
    }

    /**
     * Subscribes to an event. Multiple listeners can be attached.
     * @param {string} event    [description]
     * @param {any}    callback [description]
     */
    subscribe(event: string, callback: any): any {
        return this.events.subscribe(event, callback);
    }
}
