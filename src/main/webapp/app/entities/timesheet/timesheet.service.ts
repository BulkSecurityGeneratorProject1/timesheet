import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { JhiDateUtils } from 'ng-jhipster';

import { Timesheet } from './timesheet.model';
import { ResponseWrapper, createRequestOption } from '../../shared';

@Injectable()
export class TimesheetService {

    private resourceUrl = 'api/timesheets';
    private lookupUrl = 'api/timesheet-lookup';

    constructor(private http: Http, private dateUtils: JhiDateUtils) { }

    create(timesheet: Timesheet): Observable<Timesheet> {
        const copy = this.convert(timesheet);
        return this.http.post(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    update(timesheet: Timesheet): Observable<Timesheet> {
        const copy = this.convert(timesheet);
        return this.http.put(this.resourceUrl, copy).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    find(id: string): Observable<Timesheet> {
        return this.http.get(`${this.resourceUrl}/${id}`).map((res: Response) => {
            const jsonResponse = res.json();
            this.convertItemFromServer(jsonResponse);
            return jsonResponse;
        });
    }

    query(req?: any): Observable<ResponseWrapper> {
        const options = createRequestOption(req);
        return this.http.get(this.resourceUrl, options)
            .map((res: Response) => this.convertResponse(res));
    }

    lookup(email, year, week): Observable<ResponseWrapper> {
        return this.http.get(this.lookupUrl + '/' + email + '/' + year + '/' + week)
            .map((res: Response) => this.convertResponse(res));
    }

    delete(id: string): Observable<Response> {
        return this.http.delete(`${this.resourceUrl}/${id}`);
    }

    exportPdf(html: String): Observable<Response> {
      return this.http.post('api/convertHtmlToPdf', html);
    }

    private convertResponse(res: Response): ResponseWrapper {
        const jsonResponse = res.json();
        for (let i = 0; i < jsonResponse.length; i++) {
            this.convertItemFromServer(jsonResponse[i]);
        }
        return new ResponseWrapper(res.headers, jsonResponse, res.status);
    }

    private convertItemFromServer(entity: any) {
        entity.submitAt = this.dateUtils
            .convertDateTimeFromServer(entity.submitAt);
        entity.updatedAt = this.dateUtils
            .convertDateTimeFromServer(entity.updatedAt);
    }

    private convert(timesheet: Timesheet): Timesheet {
        const copy: Timesheet = Object.assign({}, timesheet);

        copy.submitAt = this.dateUtils.toDate(timesheet.submitAt);

        copy.updatedAt = this.dateUtils.toDate(timesheet.updatedAt);
        return copy;
    }
}
