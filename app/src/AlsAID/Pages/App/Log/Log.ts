import moment from "moment";

import { Component } from "@angular/core";

import { NavParams, ModalController } from "ionic-angular";

import { SessionInterface } from "../../../Interfaces/SessionInterface";

import { Translator } from "../../../Translator/Translator";
import { Toast } from "../../../Screen/Toast/Toast";
import { Log } from "../../../Log/Log";

import { LogUpdateModal } from "../Modals/LogUpdate/Modal";
import { MetaUpdateModal } from "../Modals/MetaUpdate/Modal";

@Component({
    selector: "page-log",
    templateUrl: "Log.html"
})
export class LogPage {

    public session: SessionInterface;
    public modal: any;

    constructor(
        public translator: Translator,
        private navParams: NavParams,
        private modalCtrl: ModalController,
        private toast: Toast,
        private log: Log
    ) {
        this.session = navParams.get("session");
        this.session.logs.forEach(log => {
            log.date = moment(log.date);
        });
    }

    showLogUpdateModal(log) {
        this.modal = this.modalCtrl.create(LogUpdateModal, {
            log: log
        });

        this.modal.onDidDismiss(data => {
            if (data.update === true) {
                this.log.updateLog(data.log).then(() => this.toast.add(this.translator.instant("global.saved")));
            }
        });

        this.modal.present();
    }

    showMetaUpdateModal(meta) {
        this.modal = this.modalCtrl.create(MetaUpdateModal, {
            meta: meta
        });

        this.modal.onDidDismiss(data => {
            if (data.update === true) {
                this.log.updateMeta(data.meta).then(() => this.toast.add(this.translator.instant("global.saved")));
            }
        });

        this.modal.present();
    }

    getMetaString(): string {
        let response = [];

        if (this.session.meta.name !== null) {
            response.push(this.session.meta.name);
        }

        if (this.session.meta.age !== null) {
            response.push(this.session.meta.age);
        }

        if (this.session.meta.sex !== null) {
            response.push(this.session.meta.sex);
        }

        if (response.length === 0) {
            return this.translator.instant("page.log.no-meta");
        }

        return response.join(", ");
    }
}
