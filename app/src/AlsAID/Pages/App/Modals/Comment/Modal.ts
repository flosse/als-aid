import { Component } from "@angular/core";

import { ViewController, NavParams } from "ionic-angular";

import { Log } from "../../../../Log/Log";
import { Translator } from "../../../../Translator/Translator";
import { Session } from "../../../../Session/Session";

@Component({
    selector: "comment-modal",
    templateUrl: "Modal.html"
})
export class CommentModal {

    public message: {
        comment: string
    } = {
        comment: ""
    };

    constructor(
        public translator: Translator,
        public viewCtrl: ViewController,
        public navParams: NavParams,
        public log: Log,
        public session: Session
    ) {

    }

    dismiss() {
        if (this.message.comment !== "") {
            let comment = this.translator.instant("page.modals.comment-prefix", {
                email: this.session.get("email")
            });

            this.log.send(`${comment}: ${this.message.comment}`);
            return this.viewCtrl.dismiss({
                updated: true
            });
        }

        return this.viewCtrl.dismiss({
            updated: false
        });
    }
}
