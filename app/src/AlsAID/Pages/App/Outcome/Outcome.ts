import { Component } from "@angular/core";
import { Events, NavParams, NavController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { Log } from "../../../Log/Log";
import { TimeProvider } from "../../../Providers/TimeProvider";

import { StartPage } from "../Start/Start";
import { LogListPage } from "../LogList/LogList";

@Component({
    selector: "page-outcome",
    templateUrl: "Outcome.html"
})
export class OutcomePage {

    public date: string = "";
    public alive: boolean = false;

    constructor(
        public translator: Translator,
        public log: Log,
        public events: Events,
        public navCtrl: NavController,
        public navParams: NavParams,
        public timeProvider: TimeProvider,
    ) {
        this.date = this.navParams.get("date");
        this.alive = this.navParams.get("alive");

        if (this.alive === true) {
            this.log.send(this.translator.instant("page.outcome.message-when-alive", {
                date: this.date
            }));
        } else {
            this.log.send(this.translator.instant("page.outcome.message-when-dead", {
                date: this.date
            }));
        }
    }

    stopSession() {
        this.events.publish("app.stop");
        this.navCtrl.setRoot(StartPage);
    }

    openLogs() {
        this.navCtrl.setRoot(LogListPage);
    }
}
