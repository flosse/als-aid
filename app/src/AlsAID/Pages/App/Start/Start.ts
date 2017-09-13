import { Component } from "@angular/core";

import { NavController, Events } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { Toast } from "../../../Screen/Toast/Toast";
import { Alert } from "../../../Screen/Alert/Alert";
import { Session } from "../../../Session/Session";
import { Http } from "../../../Http/Http";
import { UUID } from "../../../UUID/UUID";

@Component({
    selector: "page-start",
    templateUrl: "Start.html"
})
export class StartPage {

    public generated: boolean = false;

    constructor(
        public events: Events,
        public navCtrl: NavController,
        public session: Session,
        public http: Http,
        public uuid: UUID,
        public toast: Toast,
        public alert: Alert,
        public translator: Translator
    ) {
        this.generated = this.uuid.isGenerated();
    }

    start() {
        this.http.post("api/v1/session/create")
        .then(res => {
            this.uuid.setId(res.json().id);
            this.events.publish("app.start");
        })
        .catch(err => {
            this.toast.add("Error creating the session.");
        });
    }

    restart() {
        this.alert.open({
          title: this.translator.instant("global.are-you-sure-question"),
          message: this.translator.instant("page.start.warning"),
          buttons: [
            {
              text: this.translator.instant("global.no"),
            },
            {
              text: this.translator.instant("global.yes"),
              handler: () => {
                return this.start();
              }
            }
          ]
        });
    }
}
