import { Injectable } from "@angular/core";

import { LoadingController } from "ionic-angular";

@Injectable()
export class Loading {

    private instance: any;

    constructor(public loadingCtrl: LoadingController) { }

    open(params): void {
        this.instance = this.loadingCtrl.create(params);
        this.instance.present();
    }

    close(): void {
        if (typeof this.instance !== "undefined") {
            this.instance.dismiss();
        }
    }

    getInstance() {
        return this.instance;
    }
}
