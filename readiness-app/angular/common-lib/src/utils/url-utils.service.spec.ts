import { TestBed } from '@angular/core/testing';
import { URLUtilsService } from './url-utils.service';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('URLUtilsService', () => {
    let service: URLUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [NGXLogger, NGXLoggerHttpService, LoggerConfig, HttpClient, HttpHandler]
        });
        service = TestBed.get(URLUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('append query string', () => {
        const url = 'https://ap4.salesforce.com/home';
        const map = {
            Fields: 'SkillId,QueueCount,MediaType,LongestQueueTimeInSeconds',
            UpdatedSince: '2017-05-18T14:50:55.833Z'
        };
        const res = service.appendQueryString(url, map);
        expect(res).toEqual('https://ap4.salesforce.com/' +
            'home?Fields=SkillId%2CQueueCount%2CMediaType%2CLongestQueueTimeInSeconds&UpdatedSince=2017-05-18T14%3A50%3A55.833Z');
    });

    it('append query string having index of ?', () => {
        const url = 'https://ap4.salesforce.com/' +
            'home?Fields=SkillId%2CQueueCount%2CMediaType%2CLongestQueueTimeInSeconds&UpdatedSince=2017-05-18T14%3A50%3A55.833Z';
        const map = {
            Fields: 'SkillId,QueueCount,MediaType,LongestQueueTimeInSeconds',
            UpdatedSince: '2017-05-18T14:50:55.833Z'
        };
        const res = service.appendQueryString(url, map);
        expect(res).toEqual('https://ap4.salesforce.com/' +
            'home?Fields=SkillId%2CQueueCount%2CMediaType%2CLongestQueueTimeInSeconds&UpdatedSince=2017-05-18T14%3A50%3A55.833Z' +
            '&Fields=SkillId%2CQueueCount%2CMediaType%2CLongestQueueTimeInSeconds&UpdatedSince=2017-05-18T14%3A50%3A55.833Z');
    });

    it('get parameter by name', () => {
        const queryStr = '';
        const name = 'objectName';
        const res = service.getParameterByName(queryStr, name);
        expect(res).toEqual('');
    });

    it('check valid url', () => {
        const url = 'http://www.incontact.com/';
        expect(service.isValidURL(url)).toBeTruthy();
    });

    it('add param to query string', () => {
        const params = 'http://www.incontact.com/';
        const res = service.addParamToQueryString(params);
        expect(res).toBe('?http://www.incontact.com/');
    });

    it('parse query string as string', () => {
        const queryString = '?sfdcIFrameOrigin=https%3A%2F%2Fap4.salesforce.com&nonce=2bd20cefe687556940657aaf78861c13b7';
        const res = service.parseQueryString(queryString);
        expect(res).toEqual(jasmine.any(Object));
    });

    it('parse query string as null', () => {
        const queryString = null;
        const res = service.parseQueryString(queryString);
        expect(res).toEqual(jasmine.any(Object));
    });

    it('parse query string of length 0', () => {
        const queryString = '';
        const res = service.parseQueryString(queryString);
        expect(res).toEqual(jasmine.any(Object));
    });

    it('Split host name from URL', () => {
        const url = 'https://www.w3schools.com/';
        const res = service.getHostName(url);
        expect(res).toEqual('www.w3schools.com');
    });

    it('Split host name from URL empty', () => {
        const url = '';
        const res = service.getHostName(url);
        expect(res).toEqual('');
    });

    it('check host name with sf host', () => {
        const hostName = 'gs0.lightning.force.com';
        const res = service.isSFDomain(hostName);
        expect(res).toEqual(true);
    });

    it('check host name with sf host', () => {
        const hostName = 'www.w3schools.com';
        const res = service.isSFDomain(hostName);
        expect(res).toEqual(false);
    });

    it('parse url', () => {
        const url = 'https://ap4.salesforce.com/home';
        const res = service.parseUrl(url);
        expect(res).toEqual(jasmine.any(Object));
    });
});
