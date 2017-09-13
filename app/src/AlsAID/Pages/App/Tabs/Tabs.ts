import { Component } from "@angular/core";

import { NavParams } from "ionic-angular";

import { HomePage } from "../Home/Home";
import { AccountPage } from "../Account/Account";
import { AboutPage } from "../About/About";


@Component({
    templateUrl: "Tabs.html"
})
export class TabsPage {

    public HomeRoot: any = HomePage;
    public AboutRoot: any = AboutPage;
    public AccountRoot: any = AccountPage;
    public selectedIndex: number = 0;

    constructor(navParams: NavParams) {
        this.selectedIndex = navParams.data.tabIndex || 0;
    }
}
