import { Component } from "@angular/core";

import { NavController, ModalController } from "ionic-angular";

import { Event } from "../../../Event/Event";
import { Session } from "../../../Session/Session";

import { Translator } from "../../../Translator/Translator";
import { Log } from "../../../Log/Log";

import { TimeProvider } from "../../../Providers/TimeProvider";
import { CprProvider } from "../../../Providers/CprProvider";

import { CprButtonInterface } from "../../../Interfaces/CprButtonInterface";

import { CommentModal } from "../Modals/Comment/Modal";

@Component({
    selector: "page-cpr",
    templateUrl: "Cpr.html"
})
export class CprPage {

    public interval: any = null;
    public duration = this.timeProvider.getDuration();
    public begin = this.timeProvider.getBeginDate();
    public finish = this.timeProvider.getFinishDate();
    public buttons: CprButtonInterface[] = this.cprProvider.getButtons();

    constructor(
        public translator: Translator,
        public event: Event,
        public navCtrl: NavController,
        public session: Session,
        public timeProvider: TimeProvider,
        public cprProvider: CprProvider,
        public log: Log,
        private modalCtrl: ModalController
    ) {
        this.interval = setInterval(() => {
            this.update();
        }, 1000);

        this.buttons.forEach(button => {
            button.name = this.translator.instant(button.name);
        });
    }

    openCommentModal() {
        let modal = this.modalCtrl.create(CommentModal);
        modal.present();
    }

    update() {
        this.duration = this.timeProvider.getDuration();
    }

    toggleButton(button: CprButtonInterface, reason: string = "user-pause") {
        if (button.state === true) {
            this.log.send(`Thoracic compression: Started.`);
            return;
        }

        let message = `Stopped (${reason})`;
        this.log.send(`Thoracic compression: ${message}`);
    }

    clickButton(button: CprButtonInterface) {
        button.amount++;
        return this.log.send(`${button.name} (${button.amount})`);
    }

    ionViewDidLeave() {
        this.cprProvider.getToggleButtons().forEach((button: CprButtonInterface) => {
            // All toggle buttons must be set to false state before we leave this page.
            button.state = false;
            this.toggleButton(button, "page-quit");
        });
    }
}
