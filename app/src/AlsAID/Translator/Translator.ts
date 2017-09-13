import { Injectable } from "@angular/core";

import { TranslateService } from "ng2-translate";

@Injectable()
export class Translator {

    constructor(
        public translateService: TranslateService
    ) {}

    get(key: string, params: any = {}): Promise<string> {
        return new Promise(accept => {
            return this.translateService.get(key, params).subscribe(res => {
                return accept(res);
            });
        });
    }

    instant(key: string, params: any = {}): string {
        return this.translateService.instant(key, params);
    }
}
