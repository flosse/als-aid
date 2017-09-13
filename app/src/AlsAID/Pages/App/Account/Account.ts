import { Component } from "@angular/core";

import { Events, ActionSheetController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { Auth } from "../../../Auth/Auth";
import { Session } from "../../../Session/Session";

import { UserInterface } from "../../../Interfaces/UserInterface";

@Component({
    selector: "page-account",
    templateUrl: "Account.html"
})
export class AccountPage {
    public user: UserInterface;
    public actionSheet: any;

    constructor(
        public events: Events,
        public session: Session,
        public auth: Auth,
        public translator: Translator,
        public actionSheetCtrl: ActionSheetController
     ) {
        this.user = this.session.getUser();
    }

    prompt() {
        this.actionSheet = this.actionSheetCtrl.create({
            title: this.translator.instant("page.account.change-language"),
            buttons: [
              {
                text: "English",
                handler: () => {
                    this.events.publish("language.change", {
                        language: "en"
                    });
                }
              },{
                text: "Deutsch",
                handler: () => {
                    this.events.publish("language.change", {
                        language: "de"
                    });
                }
              }
            ]
        });

        this.actionSheet.present();
    }

    signout() {
        return this.auth.signout();
    }
}
