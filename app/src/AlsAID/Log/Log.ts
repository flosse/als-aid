import { Injectable } from "@angular/core";
import * as moment from "moment";

import { Http } from "../Http/Http";
import { UUID } from "../UUID/UUID";
import { Toast } from "../Screen/Toast/Toast";

@Injectable()
export class Log {

    protected duration: any = moment();

    constructor(
        public http: Http,
        public uuid: UUID,
        public toast: Toast
    ) { }

    send(message): Promise<any> {
        return this.http.post("api/v1/log/create", {
            message: message,
            date: new Date().getTime(),
            id: this.uuid.getId()
        })
        .catch(err => {
            this.toast.add(`Could not add message: ${message}`);
        });
    }

    sendAsEmail(sessionID): Promise<any> {
        return this.http.post("api/v1/session/send-as-email", {
            id: sessionID
        });
    }

    updateLog(log): Promise<any> {
        return this.http.post(`api/v1/log/${log.id}/update`, log)
        .catch(err => {
            this.toast.add(`Could not update log.`);
        });
    }

    updateMeta(meta): Promise<any> {
        return this.http.post(`api/v1/meta/${meta.id}/update`, meta)
        .catch(err => {
            this.toast.add(`Could not update meta.`);
        });
    }

    retrieveSessions(): Promise<any> {
        return this.http.get("api/v1/session");
    }
}
