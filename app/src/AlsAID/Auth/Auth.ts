import { Injectable } from "@angular/core";
import { Events } from "ionic-angular";

import { Http } from "../Http/Http";
import { Session } from "../Session/Session";
import { Translator } from "../Translator/Translator";

@Injectable()
export class Auth {

    constructor(
        public translator: Translator,
        public events: Events,
        public session: Session,
        public http: Http
    ) {}

    check() {
        return this.http.get("auth/check")
        .then(data => {
            this.session.initialize(data.json());
            this.events.publish("auth.signin");
        })
        .catch(err => {
            switch(err.status) {
                case 500:
                    return Promise.reject(new Error(this.translator.instant("error.http.500")));

                case 401:
                    return Promise.reject(new Error(this.translator.instant("error.http.401")));

                case 0:
                    return Promise.reject(new Error(this.translator.instant("error.http.0")));

                default:
                    return Promise.reject(new Error(this.translator.instant("error.unknown")));
            }
        });
    }

    forgotPassword(email: string): Promise<any> {
        return this.http.post("forgot", {
            version: "0.0.1",
            email: email,
            type: "mobile"
        })
        .catch(err => {
            switch(err.status) {
                case 500:
                    return Promise.reject(new Error(this.translator.instant("error.http.500")));

                case 404:
                    return Promise.reject(new Error("Email does not exist in database."));

                case 400:
                    return Promise.reject(new Error("Validation error."));

                case 0:
                    return Promise.reject(new Error(this.translator.instant("error.http.0")));

                default:
                    return Promise.reject(new Error(this.translator.instant("error.unknown")));
            }
        });
    }

    signin(email: string, password: string): Promise<any> {
        return this.http.post("auth/signin", {
            version: "0.0.1",
            email: email,
            password: password,
            type: "mobile",
            provider: "self"
        })
        .then(data => {
            this.session.initialize(data.json());
            this.events.publish("auth.signin");
        })
        .catch(err => {
            switch(err.status) {
                case 500:
                    return Promise.reject(new Error(this.translator.instant("error.http.500")));

                case 401:
                    return Promise.reject(new Error(this.translator.instant("error.http.401")));

                case 0:
                    return Promise.reject(new Error(this.translator.instant("error.http.0")));

                default:
                    return Promise.reject(new Error(this.translator.instant("error.unknown")));
            }
        });
    }

    signup(email: string, password: string, confirmPassword: string): Promise<any> {
        return this.http.post("auth/signup", {
            version: "0.0.1",
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            type: "mobile"
        })
        .then(data => {
            this.session.initialize(data.json());
            this.events.publish("auth.signup");
        })
        .catch(err => {
            switch(err.status) {
                case 500:
                    return Promise.reject(new Error(this.translator.instant("error.http.500")));

                case 401:
                    return Promise.reject(new Error(this.translator.instant("error.http.401")));

                case 0:
                    return Promise.reject(new Error(this.translator.instant("error.http.0")));

                default:
                    return Promise.reject(new Error(this.translator.instant("error.unknown")));
            }
        });
    }

    signout(): Promise<any> {
        return this.http.get("auth/signout", {
            type: "mobile"
        })
        .then(data => {
            this.events.publish("auth.signout");
        })
        .catch(err => {
            switch(err.status) {
                case 500:
                    return Promise.reject(new Error(this.translator.instant("error.http.500")));

                case 0:
                    return Promise.reject(new Error(this.translator.instant("error.http.0")));

                default:
                    return Promise.reject(new Error(this.translator.instant("error.unknown")));
            }
        });
    }
}
