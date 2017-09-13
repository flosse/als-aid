import { Component } from "@angular/core";

import { NavController } from "ionic-angular";

import { Translator } from "../../../Translator/Translator";
import { SignupPage } from "../Signup/Signup";
import { ForgotPasswordPage } from "../ForgotPassword/ForgotPassword";
import { Auth } from "../../../Auth/Auth";
import { Loading } from "../../../Screen/Loading/Loading";
import { Toast } from "../../../Screen/Toast/Toast";

@Component({
    selector: "page-signin",
    templateUrl: "Signin.html"
})
export class SigninPage {
    public data: {
        email?: string,
        password?: string
    } = {
        email: "",
        password: ""
    };
    public submitted: boolean = false;
    public err: boolean = false;
    public msg: string = "";

    constructor(
        public translator: Translator,
        public navCtrl: NavController,
        public auth: Auth,
        public loading: Loading,
        public toast: Toast
    ) { }

    signin(form) {
        this.submitted = true;

        if (form.valid === false) {
            this.toast.add(this.translator.instant("error.fill-the-form"));
            return;
        }

        this.loading.open({
            content: this.translator.instant("page.signin.info")
        });

        this.auth.signin(this.data.email, this.data.password)
        .then(() => {
            this.loading.close();
        })
        .catch(err => {
            this.loading.close();
            this.toast.add(err, ["toast-danger"]);
        });
    }

    forgotPassword() {
        this.navCtrl.push(ForgotPasswordPage);
    }

    signup() {
        this.navCtrl.push(SignupPage);
    }
}
