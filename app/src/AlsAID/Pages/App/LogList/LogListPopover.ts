import { Component } from '@angular/core';

import { NavController, ViewController, NavParams } from 'ionic-angular';

import { Translator } from "../../../Translator/Translator";
import { LogPage } from "../Log/Log";
import { Log } from "../../../Log/Log";
import { Toast } from "../../../Screen/Toast/Toast";
import { Loading } from "../../../Screen/Loading/Loading";

@Component({
    templateUrl: "LogListPopover.html"
})
export class LogListPopoverPage {

    protected sessionID: string;

    constructor(
        public translator: Translator,
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public navCtrl: NavController,
        public toast: Toast,
        public loading: Loading,
        public log: Log
    ) {
        this.sessionID = this.navParams.get("session").id;
    }

    open() {
        this.navCtrl.push(LogPage, {
            session: this.navParams.get("session")
        });
    }

    sendAsEmail() {
        this.loading.open({
            content: this.translator.instant("page.log-list.sending"),
        });

        this.log.sendAsEmail(this.sessionID)
        .then(() => {
            this.toast.add(this.translator.instant("page.log-list.sent"));
            this.loading.close();
            this.close();
        })
        .catch(err => {
            this.toast.add(this.translator.instant("page.log-list.failed"));
            this.loading.close();
            this.close();
        });
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
