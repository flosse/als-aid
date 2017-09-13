import { Component } from "@angular/core";

import { NavController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { ForgotPasswordPage } from "../ForgotPassword/ForgotPassword";
import { Auth } from "../../../Auth/Auth";
import { Loading } from "../../../Screen/Loading/Loading";

@Component({
    selector: "page-signup",
    templateUrl: "Signup.html"
})
export class SignupPage {
    public data: {
        email?: string,
        password?: string,
        confirmPassword?: string
    } = {};
    public submitted: boolean = false;
    public err: boolean = false;
    public msg: string = "";

    constructor(
        public translator: Translator,
        public navCtrl: NavController,
        public auth: Auth,
        public loading: Loading
    ) {}

    signup(form) {
        this.submitted = true;

        if (form.valid === false) {
            return;
        }

        this.loading.open({
            content: this.translator.instant("page.signup.info")
        });

        this.auth.signup(this.data.email, this.data.password, this.data.confirmPassword)
        .then(() => {
            this.loading.close();
        })
        .catch((err) => {
            this.loading.close();
            this.err = true;
            this.msg = err._body;
        });
    }

    forgotPassword() {
        this.navCtrl.push(ForgotPasswordPage);
    }

    signin() {
        this.navCtrl.popToRoot();
    }
}
