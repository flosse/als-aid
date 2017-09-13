import { Component } from "@angular/core";

import { NavController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { Log } from "../../../Log/Log";

import { TimeProvider } from "../../../Providers/TimeProvider";
import { OutcomePage } from "../Outcome/Outcome";


export interface CheckboxInterface {
    name: string,
    checked: boolean
}

@Component({
    selector: "page-rosc",
    templateUrl: "Rosc.html"
})
export class RoscPage {

    public checkboxes: CheckboxInterface[] = [];

    constructor(
        public translator: Translator,
        public navCtrl: NavController,
        public log: Log,
        public timeProvider: TimeProvider
    ) {
        [
            this.translator.instant("page.rosc.checkbox-1"),
            this.translator.instant("page.rosc.checkbox-2"),
            this.translator.instant("page.rosc.checkbox-3"),
            this.translator.instant("page.rosc.checkbox-4"),
            this.translator.instant("page.rosc.checkbox-5"),
            this.translator.instant("page.rosc.checkbox-6")
        ].forEach(name => {
            this.checkboxes.push({
                name: name,
                checked: false
            });
        });
    }

    stableRosc() {
        this.navCtrl.setRoot(OutcomePage, {
            date: this.timeProvider.getCurrentDate("YYYY-MM-DD HH:mm:ss"),
            alive: true
        });
    }

    onClick(checkbox: CheckboxInterface) {
        return this.log.send(`${this.translator.instant("page.rosc.prefix")}: ${checkbox.name}`);
    }
}
