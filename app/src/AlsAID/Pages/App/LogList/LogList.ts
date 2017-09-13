import { Component } from "@angular/core";

import * as moment from "moment";

import { PopoverController, ModalController } from "ionic-angular";

import { SessionInterface } from "../../../Interfaces/SessionInterface";

import { Translator } from "../../../Translator/Translator";
import { Event } from "../../../Event/Event";
import { Session } from "../../../Session/Session";
import { Loading } from "../../../Screen/Loading/Loading";
import { Toast } from "../../../Screen/Toast/Toast";
import { Log } from "../../../Log/Log";

import { LogListPopoverPage } from "./LogListPopover";

import { CommentModal } from "../Modals/Comment/Modal";

@Component({
    selector: "page-log-list",
    templateUrl: "LogList.html"
})
export class LogListPage {

    public popover: any;
    public segment: string = "today";
    public sessions: SessionInterface[] = [];

    constructor(
        public translator: Translator,
        public event: Event,
        public popoverCtrl: PopoverController,
        public session: Session,
        public loading: Loading,
        public toast: Toast,
        public log: Log,
        private modalCtrl: ModalController
    ) { }

    openCommentModal() {
        let modal = this.modalCtrl.create(CommentModal);
        modal.present();
    }

    ionViewWillEnter() {
        this.loading.open({
            content: this.translator.instant("page.log-list.retrieving")
        });

        this.log.retrieveSessions()
        .then(res => {
            this.sessions = res.json().sessions.map(session => {
                session.created_at = moment(session.created_at);
                return session;
            });
            this.loading.close();
        })
        .catch(err => {
            this.loading.close();
            this.toast.add(this.translator.instant("error.retrieve-failed"));
        });
    }

    presentPopover(event: Event, session: SessionInterface) {
        this.popover = this.popoverCtrl.create(LogListPopoverPage, {
            session: session
        });

        this.popover.present({
            ev: event
        });
    }

    todaysSessions(): SessionInterface[] {
        return this.sessions.filter(session => {
            return moment().format("YYYY-MM-DD") === session.created_at.format("YYYY-MM-DD");
        });
    }

    weeksSessions(): SessionInterface[] {
        return this.sessions.filter(session => {
            return moment().format("YYYY-WW") === session.created_at.format("YYYY-WW");
        });
    }

    monthsSessions(): SessionInterface[] {
        return this.sessions.filter(session => {
            return moment().format("YYYY-MM") === session.created_at.format("YYYY-MM");
        });
    }

    allSessions(): SessionInterface[] {
        return this.sessions;
    }

    changeSegment(event) {

    }

    getMoment() {
        return moment();
    }
}
