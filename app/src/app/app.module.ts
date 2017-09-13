import { NgModule } from "@angular/core";

import { IonicApp, IonicModule } from "ionic-angular";
import { Storage } from "@ionic/storage";

import { Http as AngularHttp, HttpModule } from "@angular/http";
import { TranslateModule, TranslateStaticLoader, TranslateLoader } from "ng2-translate";

import { Application } from "./app.component";

import { SigninPage } from "../AlsAID/Pages/Auth/Signin/Signin";
import { SignupPage } from "../AlsAID/Pages/Auth/Signup/Signup";
import { ForgotPasswordPage } from "../AlsAID/Pages/Auth/ForgotPassword/ForgotPassword";

import { AboutPage } from "../AlsAID/Pages/App/About/About";
import { PopoverPage } from "../AlsAID/Pages/App/Popover/Popover";

import { HomePage } from "../AlsAID/Pages/App/Home/Home";
import { CprPage } from "../AlsAID/Pages/App/Cpr/Cpr";
import { RoscPage } from "../AlsAID/Pages/App/Rosc/Rosc";
import { StatusPage } from "../AlsAID/Pages/App/Status/Status";
import { OutcomePage } from "../AlsAID/Pages/App/Outcome/Outcome";
import { StartPage } from "../AlsAID/Pages/App/Start/Start";
import { LogPage } from "../AlsAID/Pages/App/Log/Log";
import { LogListPage } from "../AlsAID/Pages/App/LogList/LogList";
import { LogListPopoverPage } from "../AlsAID/Pages/App/LogList/LogListPopover";
import { AccountPage } from "../AlsAID/Pages/App/Account/Account";
import { TabsPage } from "../AlsAID/Pages/App/Tabs/Tabs";
import { TutorialPage } from "../AlsAID/Pages/App/Tutorial/Tutorial";
import { DuringCPRPage } from "../AlsAID/Pages/App/DuringCPR/DuringCPR";

import { UUID } from "../AlsAID/UUID/UUID";
import { Http } from "../AlsAID/Http/Http";
import { Config } from "../AlsAID/Config/Config";
import { Session } from "../AlsAID/Session/Session";
import { Auth } from "../AlsAID/Auth/Auth";
import { Log } from "../AlsAID/Log/Log";
import { Event } from "../AlsAID/Event/Event";
import { Translator } from "../AlsAID/Translator/Translator";

import { Loading } from "../AlsAID/Screen/Loading/Loading";
import { Toast } from "../AlsAID/Screen/Toast/Toast";
import { Alert } from "../AlsAID/Screen/Alert/Alert";

import { LogUpdateModal } from "../AlsAID/Pages/App/Modals/LogUpdate/Modal";
import { MetaUpdateModal } from "../AlsAID/Pages/App/Modals/MetaUpdate/Modal";
import { CommentModal } from "../AlsAID/Pages/App/Modals/Comment/Modal";

import { PatientProvider } from "../AlsAID/Providers/PatientProvider";
import { TimeProvider } from "../AlsAID/Providers/TimeProvider";
import { CprProvider } from "../AlsAID/Providers/CprProvider";

export function createTranslateLoader(http: AngularHttp) {
    return new TranslateStaticLoader(http, "./assets/i18n", ".json");
}

@NgModule({
  declarations: [
    Application,
    HomePage,
    OutcomePage,
    CprPage,
    RoscPage,
    StatusPage,
    StartPage,
    LogPage,
    LogListPage,
    AboutPage,
    AccountPage,
    SigninPage,
    ForgotPasswordPage,
    PopoverPage,
    LogListPopoverPage,
    LogUpdateModal,
    MetaUpdateModal,
    CommentModal,
    SignupPage,
    TabsPage,
    TutorialPage,
    DuringCPRPage
  ],
  imports: [
    IonicModule.forRoot(Application, {
        backButtonText: "",
        color: "primary",
        iconMode: "ios",
        tabsPlacement: "top",
        tabsHideOnSubPages: true
    }),
    HttpModule,
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [AngularHttp]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    Application,
    HomePage,
    OutcomePage,
    CprPage,
    RoscPage,
    StatusPage,
    StartPage,
    LogPage,
    LogListPage,
    AboutPage,
    AccountPage,
    SigninPage,
    ForgotPasswordPage,
    PopoverPage,
    LogListPopoverPage,
    LogUpdateModal,
    MetaUpdateModal,
    CommentModal,
    SignupPage,
    TabsPage,
    TutorialPage,
    DuringCPRPage
  ],
  providers: [
    Loading,
    Toast,
    Alert,
    Event,
    Session,
    Auth,
    Translator,
    Log,
    Storage,
    Config,
    Http,
    UUID,
    PatientProvider,
    TimeProvider,
    CprProvider
  ]
})
export class AppModule {}
