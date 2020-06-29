export interface Status {
    code: number;
    message?: string;
}

export class StatusResponse {
    static OK: Status = { code: 200, message: 'Ok' };

    status: Status;

    constructor();
    constructor(status: Status);
    constructor(code: number, message?: string);
    constructor(statusOrCode?: Status | number, message?: string) {
        if (typeof statusOrCode === 'undefined') {
            this.status = StatusResponse.OK;
        }
        else if (typeof statusOrCode === 'object') {
            this.status = statusOrCode;
        }
        else {
            this.status = { code: statusOrCode, message };
        }
    }
}