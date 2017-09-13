import { Component } from "@angular/core";
import { MenuController, NavController, ViewController, Slides } from "ionic-angular";

@Component({
  selector: "page-duringcpr",
  templateUrl: "DuringCPR.html"
})

export class DuringCPRPage {
  protected showSkip: boolean = true;
  protected numbers: number[] = [];

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public viewCtrl: ViewController
  ) {
    this.numbers = Array(8).fill(0).map((x, i) => i + 1);
  }

  dismiss() {
    return this.viewCtrl.dismiss();
  }

  onSlideChangeStart(slider: Slides) {

  }

  ionViewDidEnter() {
    this.menu.enable(false);
  }

  ionViewDidLeave() {
    this.menu.enable(true);
  }
}
