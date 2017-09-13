import { Injectable } from "@angular/core";

import { AlertController } from "ionic-angular";

@Injectable()
export class Alert {

    private instance: any;

    constructor(public alertCtrl: AlertController) { }

    open(params) {
        this.instance = this.alertCtrl.create(params);
        this.instance.present();

        return this.instance;
    }

    close(): void {
        if (this.instance !== null) {
            this.instance.dismiss();
        }
    }

    getInstance() {
        return this.instance;
    }
}
