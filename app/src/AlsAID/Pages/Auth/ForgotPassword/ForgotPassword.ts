import { Component } from "@angular/core";

import { NavController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { Auth } from "../../../Auth/Auth";
import { Loading } from "../../../Screen/Loading/Loading";
import { Toast } from "../../../Screen/Toast/Toast";

@Component({
    selector: "page-forgot-password",
    templateUrl: "ForgotPassword.html"
})
export class ForgotPasswordPage {
    public data: {
        email?: string
    } = {
        email: ""
    };

    constructor(
        public navCtrl: NavController,
        public auth: Auth,
        public loading: Loading,
        public toast: Toast,
        public translator: Translator
    ) { }

    forgotPassword(form) {
        if (form.valid === false) {
            this.toast.add(this.translator.instant("error.fill-the-form"));
            return;
        }

        this.loading.open({
            content: "Sending reset email..."
        });

        this.auth.forgotPassword(this.data.email)
        .then(() => {
            this.toast.add("Please check your email inbox for instructions.");
            this.loading.close();
        })
        .catch(err => {
            this.loading.close();
            this.toast.add(err, ["toast-danger"]);
        });
    }

    signin() {
        this.navCtrl.popToRoot();
    }
}
