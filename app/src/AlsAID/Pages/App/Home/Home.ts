import { Component } from "@angular/core";

import { NavController, ModalController } from "ionic-angular";

import { Event } from "../../../Event/Event";
import { Session } from "../../../Session/Session";
import { Translator } from "../../../Translator/Translator";
import { Toast } from "../../../Screen/Toast/Toast";

import { CprPage } from "../Cpr/Cpr";
import { RoscPage } from "../Rosc/Rosc";
import { StatusPage } from "../Status/Status";

import { TimeProvider } from "../../../Providers/TimeProvider";

import { CommentModal } from "../Modals/Comment/Modal";

@Component({
    selector: "page-home",
    templateUrl: "Home.html"
})
export class HomePage {

    public interval: any = null;
    public duration = this.timeProvider.getDuration();
    public begin = this.timeProvider.getBeginDate();
    public finish = this.timeProvider.getFinishDate();

    constructor(
        public event: Event,
        public navCtrl: NavController,
        public session: Session,
        public translator: Translator,
        public toast: Toast,
        public timeProvider: TimeProvider,
        private modalCtrl: ModalController
    ) {
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
    }

    openCommentModal() {
        let modal = this.modalCtrl.create(CommentModal);

        modal.onDidDismiss(res => {
            if (res.updated === true) {
                this.toast.add(this.translator.instant("global.comment-added"));
            }
        });

        modal.present();
    }

    openCpr() {
        this.navCtrl.push(CprPage);
    }

    openRosc() {
        this.navCtrl.push(RoscPage);
    }

    openStatus() {
        this.navCtrl.push(StatusPage);
    }

    update() {
        this.duration = this.timeProvider.getDuration();
    }
}
