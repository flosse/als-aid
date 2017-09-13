import { Component } from "@angular/core";

import { PopoverController } from "ionic-angular";

import { PopoverPage } from "../Popover/Popover";

@Component({
  selector: "page-about",
  templateUrl: "About.html"
})
export class AboutPage {

  constructor(
      public popoverCtrl: PopoverController
  ) { }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({ ev: event });
  }
}