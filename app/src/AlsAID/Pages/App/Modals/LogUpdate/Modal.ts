import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: "log-update-modal",
    templateUrl: "Modal.html"
})
export class LogUpdateModal {

    public log: any;
    protected initial: string;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams
    ) {
        this.log = this.navParams.get("log");
        this.initial = this.log.message;
    }

    dismiss() {
        if (this.initial !== this.log.message) {
            return this.viewCtrl.dismiss({
                update: true,
                log: this.log
            });
        }

        return this.viewCtrl.dismiss({
            update: false,
            log: this.log
        });
    }
}
