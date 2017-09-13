import { Injectable } from "@angular/core";

import { ToastController } from "ionic-angular";

@Injectable()
export class Toast {

    private instance: any;

    constructor(public toastCtrl: ToastController) { }

    add(message, classes: string[] = []) {
        this.instance = this.toastCtrl.create({
            message: message,
            duration: 3000,
            position: "top",
            cssClass: classes.join(" ")
        });
        this.instance.present();
    }

}


