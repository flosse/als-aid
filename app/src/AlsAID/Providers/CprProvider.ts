import { Injectable } from "@angular/core";

import { CprButtonInterface } from "../Interfaces/CprButtonInterface";

@Injectable()
export class CprProvider {

    public buttons: CprButtonInterface[] = [
        {
            name: "page.cpr.button-1",
            isToggle: true,
            state: false
        },
        {
            name: "page.cpr.button-2",
            isToggle: false,
            amount: 0
        },
        {
            name: "page.cpr.button-3",
            isToggle: false,
            amount: 0
        },
        {
            name: "page.cpr.button-4",
            isToggle: false,
            amount: 0
        }
    ];

    constructor() {

    }

    refresh() {
        this.buttons.forEach((button: CprButtonInterface) => {
            if (button.isToggle === true) {
                button.state = false;
            }

            if (button.isToggle === false) {
                button.amount = 0;
            }
        });
    }

    getToggleButtons(): CprButtonInterface[] {
        return this.buttons.filter(button => button.isToggle === true);
    }

    getButtons(): CprButtonInterface[] {
        return this.buttons;
    }
}
