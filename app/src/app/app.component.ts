import { Component, ViewChild } from "@angular/core";

import { Nav, Platform, MenuController } from "ionic-angular";

import { StatusBar, Splashscreen } from "ionic-native";

import { Storage } from "@ionic/storage";

import { TranslateService } from "ng2-translate";

import { SigninPage } from "../AlsAID/Pages/Auth/Signin/Signin";

import { TutorialPage } from "../AlsAID/Pages/App/Tutorial/Tutorial";
import { DuringCPRPage } from "../AlsAID/Pages/App/DuringCPR/DuringCPR";
import { HomePage } from "../AlsAID/Pages/App/Home/Home";
import { StartPage } from "../AlsAID/Pages/App/Start/Start";
import { LogListPage } from "../AlsAID/Pages/App/LogList/LogList";
import { AboutPage } from "../AlsAID/Pages/App/About/About";
import { AccountPage } from "../AlsAID/Pages/App/Account/Account";

import { UUID } from "../AlsAID/UUID/UUID";
import { Http } from "../AlsAID/Http/Http";
import { Auth } from "../AlsAID/Auth/Auth";
import { Session } from "../AlsAID/Session/Session";
import { Log } from "../AlsAID/Log/Log";

import { Event } from "../AlsAID/Event/Event";
import { Loading } from "../AlsAID/Screen/Loading/Loading";
import { Alert } from "../AlsAID/Screen/Alert/Alert";

import { TimeProvider } from "../AlsAID/Providers/TimeProvider";
import { CprProvider } from "../AlsAID/Providers/CprProvider";
import { Translator } from "../AlsAID/Translator/Translator";

export interface PageInterface {
    title: string;
    component: any;
    icon: string;
    tabComponent?: any;
}

@Component({
    templateUrl: "layout.html"
})
export class Application {

    public rootPage: any;

    @ViewChild(Nav) nav: Nav;

    appPages: PageInterface[] = [];

    public defaultPages = {
        home: HomePage,
        start: StartPage,
        auth: SigninPage,
        tutorial: TutorialPage
    };

    private started: boolean = false;

    constructor(
        public translate: TranslateService,
        public translator: Translator,
        public http: Http,
        public uuid: UUID,
        public menu: MenuController,
        public event: Event,
        public auth: Auth,
        public session: Session,
        public loading: Loading,
        public alert: Alert,
        public platform: Platform,
        public log: Log,
        public timeProvider: TimeProvider,
        public cprProvider: CprProvider,
        public storage: Storage
    ) {

        this.translate.setDefaultLang("en");

        this.listenEvents();

        platform.ready().then(() => {
            console.log("Ionic Platform is ready.");

            // Let's check the platform before executing Cordova plugins.
            if (platform.is("ios") === true || platform.is("android") === true) {
                this.hideSplashscreen();
                this.changeStatusBar();
            }
        })
        .then(() => {
            return this.storage.get("user.language");
        })
        .then(language => {
            this.translate.use(language || "en");
        })
        .then(() => {
            // Give some time for language files to load.
            setTimeout(() => {
                this.appPages = [
                    {
                        title: this.translator.instant("page.start.title"),
                        component: StartPage,
                        tabComponent: StartPage,
                        icon: "md-time"
                    },
                    {
                        title: this.translator.instant("page.home.title"),
                        component: HomePage,
                        tabComponent: HomePage,
                        icon: "ios-pulse"
                    },
                    {
                        title: this.translator.instant("page.log-list.title"),
                        component: LogListPage,
                        tabComponent: LogListPage,
                        icon: "md-document"
                    },
                    {
                        title: this.translator.instant("page.account.title"),
                        component: AccountPage,
                        tabComponent: AccountPage,
                        icon: "md-person"
                    },
                    {
                        title: this.translator.instant("page.tutorial.title"),
                        component: TutorialPage,
                        tabComponent: TutorialPage,
                        icon: "md-help-circle"
                    },
                    {
                        title: this.translator.instant("page.duringcpr.title"),
                        component: DuringCPRPage,
                        tabComponent: DuringCPRPage,
                        icon: "md-help-circle"
                    },
                    {
                        title: this.translator.instant("page.about.title"),
                        component: AboutPage,
                        tabComponent: AboutPage,
                        icon: "md-information-circle"
                    }
                ];

                this.auth.check()
                .catch(err => {
                    this.enableMenu(false);
                    this.nav.setRoot(this.defaultPages.auth);
                });
            }, 50);
        });
    }

    changeStatusBar(): void {
        StatusBar.overlaysWebView(true);
        StatusBar.backgroundColorByHexString("#344494");
    }

    hideSplashscreen(): void {
        Splashscreen.hide();
    }

    getSession() {
        return this.session;
    }

    enableMenu(loggedIn: boolean) {
        this.menu.enable(loggedIn && this.started, "loggedInMenu");
    }

    openPage(page: PageInterface) {
        if (page.component.name === "TutorialPage" || page.component.name === "DuringCPRPage") {
            return this.nav.push(page.component)
            .then(() => {
                return this.log.send(`Page: ${page.component.name}`);
            });
        }
        return this.nav.setRoot(page.component)
        .then(() => {
            return this.log.send(`Page: ${page.component.name}`);
        });
    }

    listenEvents() {
        this.event.subscribeOnce("app.start", () => {
            console.log("app.start");
            this.log.send("Application started.");
            this.timeProvider.refresh();
            this.cprProvider.refresh();
            this.started = true;
            this.enableMenu(true);
            this.nav.setRoot(this.defaultPages.home);
        });

        this.event.subscribeOnce("app.stop", () => {
            console.log("app.stop");
            this.started = false;
            this.enableMenu(false);
        });

        this.event.subscribeOnce("auth.signin", () => {
            console.log("auth.signin");
            this.enableMenu(false);
            this.nav.setRoot(this.defaultPages.start);
        });

        this.event.subscribeOnce("auth.signup", () => {
            console.log("auth.signup");
            this.enableMenu(false);
            this.nav.setRoot(this.defaultPages.start);
        });

        this.event.subscribeOnce("auth.signout", () => {
            console.log("auth.signout");
            this.enableMenu(false);
            this.nav.setRoot(this.defaultPages.auth);
        });

         this.event.subscribeOnce("language.change", (data) => {
            console.log("language.change");
            this.storage.set("user.language", data.language);
            this.translate.use(data.language);
        });
    }

    signout() {
        return this.auth.signout();
    }

    isActive(page: PageInterface) {
        let childNav = this.nav.getActiveChildNav();

        // Tabs are a special case because they have their own navigation
        if (childNav) {
            if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
                return "danger";
            }
            return;
        }

        if (this.nav.getActive() && this.nav.getActive().component === page.component) {
            return "danger";
        }

        return "primary";
    }
}
