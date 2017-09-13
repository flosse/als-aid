import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable()
export class TimeProvider {

    protected begin: any;
    protected current: any;

    constructor() {
        this.refresh();

        setInterval(() => {
            this.current.add(1, "second");
        }, 1000);
    }

    refresh() {
        this.begin = moment();
        this.current = moment();
    }

    getDiff(): number {
        return parseInt(moment.duration(moment().diff(this.begin)).asSeconds().toString(), 10);
    }

    getCurrentDate(format: string = "") {
        if (format === "") {
            return this.current.format("HH:mm:ss");
        }

        return this.current.format(format);
    }

    getDuration() {
        return moment.utc(moment.duration(this.current.diff(this.begin)).as("milliseconds")).format("HH:mm:ss");
    }

    getBeginDate() {
        return this.begin.format("HH:mm:ss");
    }

    getFinishDate() {
        return "---";
    }
}
