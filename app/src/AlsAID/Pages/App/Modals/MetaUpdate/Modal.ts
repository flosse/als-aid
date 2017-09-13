import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';

@Component({
    selector: "meta-update-modal",
    templateUrl: "Modal.html"
})
export class MetaUpdateModal {

    public meta: any;
    public update: boolean = false;

    constructor(
        public viewCtrl: ViewController,
        public navParams: NavParams
    ) {
        this.meta = this.navParams.get("meta");
    }

    enable() {
        this.update = true;
    }

    dismiss() {
        return this.viewCtrl.dismiss({
            update: this.update,
            meta: this.meta
        });
    }
}
