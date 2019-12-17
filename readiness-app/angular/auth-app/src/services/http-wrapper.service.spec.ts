import { TestBed } from '@angular/core/testing';
import { HttpWrapperService } from './http-wrapper.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LocalStorageService, DatastoreKeys } from 'common-lib';
import { HttpHeaders } from '@angular/common/http';

describe('HttpWrapperService', () => {
    let service: HttpWrapperService;
    let localStorageSvc: LocalStorageService;
    let httpTestingController: HttpTestingController;
    let authToken: any;
    const contentType = 'application/json; charset=UTF-8';
    beforeEach(() => {
        authToken = {
            'accessToken': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9',
            'refreshToken': 'hNzwzl3o5EqtwyZpFj0SzA==',
            'expiresIn': 3600,
            'accessTokenTime': 1554800249066
        };
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule
            ]
        });
        localStorageSvc = TestBed.get(LocalStorageService);
        localStorageSvc.set(DatastoreKeys.AuthToken, JSON.stringify(authToken));
        service = TestBed.get(HttpWrapperService);
        httpTestingController = TestBed.get(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('get request functionality', () => {
        it('get request should contain authorization header with access token and json content type header', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/teams/123/unavailable-codes';
            service.get(url).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Authorization')).toBe(true);
            expect(req.request.headers.get('Authorization')).toEqual('bearer ' + authToken.accessToken);
            expect(req.request.headers.has('Content-Type')).toBe(true);
            expect(req.request.headers.get('Content-Type')).toEqual(contentType);
        });

        it('get request should contain the headers passed instead of default headers', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/teams/123/unavailable-codes';
            service.get(url, new HttpHeaders({
                'Accept': contentType
            })).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Accept')).toBe(true);
            expect(req.request.headers.get('Accept')).toEqual(contentType);
        });
    });

    describe('post request functionality', () => {
        it('post request should contain authorization header with access token and json content type header', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions';
            service.post(url, null).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Authorization')).toBe(true);
            expect(req.request.headers.get('Authorization')).toEqual('bearer ' + authToken.accessToken);
            expect(req.request.headers.has('Content-Type')).toBe(true);
            expect(req.request.headers.get('Content-Type')).toEqual(contentType);
        });

        it('post request should contain the headers passed instead of default headers', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions';
            service.post(url, null, new HttpHeaders({
                'Accept': contentType
            })).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Accept')).toBe(true);
            expect(req.request.headers.get('Accept')).toEqual(contentType);
        });
    });

    describe('put request functionality', () => {
        it('put request should contain authorization header with access token and json content type header', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions';
            service.put(url, null).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Authorization')).toBe(true);
            expect(req.request.headers.get('Authorization')).toEqual('bearer ' + authToken.accessToken);
            expect(req.request.headers.has('Content-Type')).toBe(true);
            expect(req.request.headers.get('Content-Type')).toEqual(contentType);
        });

        it('put request should contain the headers passed instead of default headers', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions';
            service.put(url, null, new HttpHeaders({
                'Accept': contentType
            })).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Accept')).toBe(true);
            expect(req.request.headers.get('Accept')).toEqual(contentType);
        });
    });

    describe('delete request functionality', () => {
        it('delete request should contain authorization header with access token and json content type header', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions/Y0xkWVZGdlJ1RUlsc0tK';
            service.delete(url).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Authorization')).toBe(true);
            expect(req.request.headers.get('Authorization')).toEqual('bearer ' + authToken.accessToken);
            expect(req.request.headers.has('Content-Type')).toBe(true);
            expect(req.request.headers.get('Content-Type')).toEqual(contentType);
        });

        it('delete request should contain the headers passed instead of default headers', () => {
            const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/agent-sessions/Y0xkWVZGdlJ1RUlsc0tK';
            service.delete(url, new HttpHeaders({
                'Accept': contentType
            })).subscribe();
            const req = httpTestingController.expectOne(url);
            expect(req.request.headers.has('Accept')).toBe(true);
            expect(req.request.headers.get('Accept')).toEqual(contentType);
        });
    });

    it('should return response in text format' , () => {
        const url = '/assets/windows-zones.xml';
        service.getText(url).subscribe();
        const req = httpTestingController.expectOne(url);
        expect(req.request.responseType).toEqual('text');
    });

    it('delete request should contain the body', () => {
        const url = 'https://hc8.ucnlabext.com/InContactAPI/services/v15.0/scheduled-callbacks/1234';
        const body = {'description': 'deleting'};
        service.deleteWithBody(url, body, new HttpHeaders({
            'Accept': contentType
        })).subscribe();
        const req = httpTestingController.expectOne(url);
        expect(JSON.stringify(req.request.body)).toEqual(JSON.stringify(body));
    });
});
