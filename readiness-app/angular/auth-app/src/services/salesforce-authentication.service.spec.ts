declare var sforce: any;

import { TestBed } from '@angular/core/testing';

import { SalesforceAuthenticationService } from './salesforce-authentication.service';
import { AuthToken, AuthenticateSettings } from 'common-lib';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';

describe('SalesforceAuthenticationService', () => {
  let service: SalesforceAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [SalesforceAuthenticationService, NGXLogger, NGXLoggerHttpService, LoggerConfig]
    });
    service = TestBed.get(SalesforceAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get incontact authentication settings - ', () => {
    it('testing success', () => {
      sforce.opencti.testing = 'success';
      service.getAuthenticationSettings().then((response: AuthenticateSettings) => {
        expect(response.centralTokenUrl).toEqual('https://sc10.incontact.com/InContactAuthorizationServer/Token');
      });
    });

    it('testing opencti error', () => {
      sforce.opencti.testing = 'opencti error';
      service.getAuthenticationSettings().catch((error) => {
        expect(error).toEqual('callcenter settings error');
      });
    });

    it('testing error', () => {
      sforce.opencti.testing = 'error';
      service.getAuthenticationSettings().catch((error) => {
        expect(error).toBe(true);
      });
    });

    it('testing exception', () => {
      sforce.opencti.testing = 'exception';
      service.getAuthenticationSettings().catch((error) => {
        expect(error).toEqual('Cannot read property \'success\' of undefined');
      });
    });
  });

  describe('store user credentials - ', () => {
    const username = 'naveenp@hc8.com';
    const password = 'welcome123';
    const rememberMe = true;
    it('testing success', () => {
      sforce.opencti.testing = 'success';
      service.storeUserCredentials(username, password, rememberMe).then((response: boolean) => {
        expect(response).toBe(true);
      });
    });
    it('testing error', () => {
      sforce.opencti.testing = 'error';
      service.storeUserCredentials(username, password, rememberMe).catch((error) => {
        expect(error).toEqual('not able to store user credentials');
      });
    });
    it('testing run apex error', () => {
      sforce.opencti.testing = 'run apex error';
      service.storeUserCredentials(username, password, rememberMe).catch((error) => {
        expect(error).toEqual('run apex error');
      });
    });
    it('testing result error', () => {
      sforce.opencti.testing = 'result error';
      service.storeUserCredentials(username, password, rememberMe).catch((error) => {
        expect(error).toBe(true);
      });
    });
    it('testing exception', () => {
      sforce.opencti.testing = 'exception';
      service.storeUserCredentials(username, password, rememberMe).catch((error) => {
        expect(error).toEqual('Cannot read property \'success\' of undefined');
      });
    });
  });

  describe('get access token - ', () => {
    const centralTokenUrl = 'http://hc8-ucnlabtext.incontact.com';
    it('testing success', () => {
      sforce.opencti.testing = 'success';
      service.getAccessToken(centralTokenUrl).then((response: AuthToken) => {
        expect(response.accessToken).toEqual('eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9');
      });
    });
    it('testing error', () => {
      sforce.opencti.testing = 'error';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toBe(true);
      });
    });
    it('throw run apex error', () => {
      sforce.opencti.testing = 'run apex error';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toEqual('run apex error');
      });
    });
    it('testing result error', () => {
      sforce.opencti.testing = 'result error';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toBe(true);
      });
    });
    it('testing exception', () => {
      sforce.opencti.testing = 'exception';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toEqual('Cannot read property \'success\' of undefined');
      });
    });
    it('throw invalid credentials error', () => {
      sforce.opencti.testing = 'invalid credentials';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toEqual('You have entered a wrong username or password');
      });
    });
    it('throw account locker error', () => {
      sforce.opencti.testing = 'account locked';
      service.getAccessToken(centralTokenUrl).catch((error) => {
        expect(error).toEqual('For security reasons, your account is locked. Please contact your manager to unlock your account.');
      });
    });
  });

  describe('Open id configuration', () => {
    let httpTestingController: HttpTestingController;
    beforeEach(() => {
      httpTestingController = TestBed.get(HttpTestingController);
    });
    afterEach(() => {
      httpTestingController.verify();
    });
    it('get sso auth details', () => {
      const response = {
        'openIdAuthorize': 'https://dev-782564.oktapreview.com/oauth2/v1/authorize',
        'openIdClientId': '1234567890',
        'bus_no': 28,
        'icAuthorizationUrl': 'https://api-sc11.ucnlabext.com/InContactAuthorizationServer/Token',
        'icAuthenticationEnabled': true,
        'openIdAuthRequestParams': null
      };
      service.getOpenIDConfiguration('http://hc8-ucnlabtext.incontact.com/authorization').subscribe((res: any) => {
        expect(res.openIdAuthorize).toEqual('https://dev-782564.oktapreview.com/oauth2/v1/authorize');
      });

      const req = httpTestingController.expectOne('http://hc8-ucnlabtext.incontact.com/authorization');
      req.flush(response);
    });

    it('error on getting sso auth details', () => {
      service.getOpenIDConfiguration('http://hc8-ucnlabtext.incontact.com/authorization2').subscribe((res: any) => {
        expect(res.openIdClientId).toEqual('1234567890');
      },
      (error) => {
        expect(error).toBeDefined();
      });

      const req = httpTestingController.expectOne('http://hc8-ucnlabtext.incontact.com/authorization2');
      req.error(new ErrorEvent('FAILED'));
    });
  });
});
