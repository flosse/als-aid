import { Injectable } from "@angular/core";

import { Http as AngularHttp } from "@angular/http";

import { Config } from "../Config/Config";

@Injectable()
export class Http {

    constructor(
        public http: AngularHttp,
        public config: Config
    ) {}

    get(path: string, params: any = {}, withCredentials: boolean = true): Promise<any> {
        return new Promise((accept, reject) => {
            params.withCredentials = withCredentials;
            this.http.get(this.config.getEndpoint(path), params)
            .subscribe(
                data => {
                    return accept(data);
                },
                err => {
                    return reject(err);
                }
            );
        });
    }

    post(path: string, params: any = {}, withCredentials: boolean = true): Promise<any> {
        return new Promise((accept, reject) => {
            let credentials = {
                withCredentials: withCredentials
            };

            this.http.post(this.config.getEndpoint(path), params, credentials)
            .subscribe(
                data => {
                    return accept(data);
                },
                err => {
                    return reject(err);
                }
            );
        });
    }
}
