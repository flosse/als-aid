import { Component } from "@angular/core";

import { NavController } from "ionic-angular";

import { Log } from "../../../Log/Log";

import { Translator } from "../../../Translator/Translator";
import { TimeProvider } from "../../../Providers/TimeProvider";
import { OutcomePage } from "../Outcome/Outcome";
import { LogListPage } from "../LogList/LogList";

export interface CheckboxInterface {
    name: string,
    checked: boolean
}

@Component({
    selector: "page-status",
    templateUrl: "Status.html"
})
export class StatusPage {

    public checkboxes: CheckboxInterface[] = [];

    constructor(
        public translator: Translator,
        public navCtrl: NavController,
        public log: Log,
        public timeProvider: TimeProvider
    ) {
        [
            this.translator.instant("page.status.checkbox-1"),
            this.translator.instant("page.status.checkbox-2"),
            this.translator.instant("page.status.checkbox-3"),
            this.translator.instant("page.status.checkbox-4")
        ].forEach(name => {
            this.checkboxes.push({
                name: name,
                checked: false
            });
        });
    }

    isAllChecked() {
        return this.checkboxes.every(checkbox => checkbox.checked === true);
    }

    onClick(checkbox: CheckboxInterface) {
        return this.log.send(`${this.translator.instant("page.status.prefix")}: ${checkbox.name}`);
    }

    openOutcome() {
        this.navCtrl.setRoot(OutcomePage, {
            date: this.timeProvider.getCurrentDate("YYYY-MM-DD HH:mm:ss"),
            alive: false
        });
    }

    openLog() {
        this.navCtrl.setRoot(LogListPage);
    }
}
