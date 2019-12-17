declare var sforce: any;

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { SalesforceAuthenticationService } from '../../services/salesforce-authentication.service';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { AccessTokenService, LocalStorageService, DatastoreKeys, SessionStorageService } from 'common-lib';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { ApexParams } from '../../common/apex-params';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let accessTokenSvc: AccessTokenService;
  let localStorageSvc: LocalStorageService;
  let sessionStorageSvc: SessionStorageService;
  const openIDConfigVar = 'openIDConfig';
  const sfSessionId = '00D6F000001cftD!AQMAQEniEOnxq';
  let httpTestingController;

  beforeEach(async(() => {
    const authSetting = {
      'centralMyDomain': 'https://thirdpartyasidp.ucnlabext.com',
      'centralTokenUrl': 'https://api-sc11.ucnlabext.com/InContactAuthorizationServer/Token',
      'isUserHub': false,
      'userHubLoginBaseUrl': '',
      'userHubNotificationUrl': '',
      'userHubWebBaseUrl': '',
      'forgotPassword': 'https://home-sc11.ucnlabext.com/inContact/ForgotPassword.aspx'
    };

    const apexParams = {
      namespacePrefix: 'test',
      icUsername: 'test@hc8.com',
      icRememberMe: false,
      authCallbackUrl: 'http://localhost:4201/authenticate/apex/authcallback',
      resourceBase: '.',
      langCode: 'en_US',
      sfSessionId : sfSessionId
    };
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/'),
            deps: [HttpClient]
          }
        })
      ],
      declarations: [ LoginComponent ],
      providers: [NGXLogger, NGXLoggerHttpService, LoggerConfig,
        {provide: 'AuthenticationService', useClass: SalesforceAuthenticationService}]
    })
    .compileComponents();

    accessTokenSvc = TestBed.get(AccessTokenService);
    localStorageSvc = TestBed.get(LocalStorageService);
    sessionStorageSvc = TestBed.get(SessionStorageService);
    sessionStorageSvc.set(DatastoreKeys.InitParam, JSON.stringify(apexParams));
    localStorageSvc.set(DatastoreKeys.AuthSettings, JSON.stringify(authSetting));
    localStorageSvc.set(DatastoreKeys.SFSessionId, sfSessionId);
    sessionStorageSvc.set(DatastoreKeys.AuthErrors, 'Auth Callback Error');
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  afterEach(() => {
    sessionStorageSvc.remove(DatastoreKeys.AuthErrors);
    sessionStorageSvc.remove(DatastoreKeys.AuthIdpConfig);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('SSO authenticate agent - ', () => {
    it('get SSO Authentication Settings exception case', () => {
      sforce.opencti.testing = 'exception';
      localStorageSvc.remove(DatastoreKeys.AuthSettings);
      component.ngOnInit();
    });

    it('get SSO Authentication Settings success case', async(() => {
      sforce.opencti.testing = 'success-openid';
      localStorageSvc.remove(DatastoreKeys.AuthSettings);
      component.ngOnInit();
      setTimeout(() => {
        const authSetting = JSON.parse(localStorageSvc.get(DatastoreKeys.AuthSettings));
        expect(authSetting.centralMyDomain).toEqual('https://thirdpartyasidp.ucnlabext.com');
      });
    }));

  

    it('get Open Id configuration failure', async(() => {
      httpTestingController = TestBed.get(HttpTestingController);

      setTimeout(() => {
        const req = httpTestingController.expectOne('https://thirdpartyasidp.ucnlabext.com/inContact/Login.aspx');
        req.error(new ErrorEvent('FAILED'));
        httpTestingController.verify();
      });
    }));

    it('get Open Id configuration success', async(() => {
      httpTestingController = TestBed.get(HttpTestingController);

      setTimeout(() => {
        const response = {
          bus_no: '1234',
          icAuthenticationEnabled: true,
          icAuthorizationUrl: 'https://api-sc11.ucnlabext.com/InContactAuthorizationServer/Token',
          openIdAuthRequestParams:  { 'authCode': '2245' },
          openIdAuthorize: 'https://dev-233046.oktapreview.com/oauth2/v1/authorize',
          openIdClientId: '1234567890'
        };
        const req = httpTestingController.expectOne('https://thirdpartyasidp.ucnlabext.com/inContact/Login.aspx');
        req.flush(response);
        expect(component[openIDConfigVar].busNo).toEqual(response.bus_no);
        httpTestingController.verify();
      });
    }));


    // it('recoverPassword', () => {
    //   spyOn( window, 'open' ).and.callFake(() => {
    //     return true;
    //   });
    //   component.recoverPassword();
    //   expect( window.open ).toHaveBeenCalled();
    // });
  });

  it('hide auth settings error', () => {
    component.hideAuthSettingsError();

    expect(component.errorMessage.authSettingsError).toEqual('');
  });

  describe('authenticate agent - ', () => {
    beforeEach(() => {
      component.username.value = 'test@hc8.com';
      component.rememberMe.value = false;
    });

  describe('togglePassword', () => {
    it('show password', () => {
      component.canShowPwd = false;
      component.togglePassword();
      expect(component.canShowPwd).toBe(true);
    });
    it('hide password', () => {
      component.canShowPwd = true;
      component.togglePassword();
      expect(component.canShowPwd).toBe(false);
    });
  });

  describe('canAuthenticateCentral', () => {
    const apexParams = {
      namespacePrefix: 'test',
      icUsername: 'test@hc8.com',
      icRememberMe: false,
      authCallbackUrl: 'http://localhost:4201/authenticate/apex/authcallback',
      resourceBase: '.',
      langCode: 'en_US'
    };
    beforeEach(() => {
      localStorageSvc.remove(DatastoreKeys.AuthSettings);
      sforce.opencti.testing = 'success';
    });
    it('do not auto authenticate if icRememberMe is false', () => {
      apexParams.icRememberMe = false;
      sessionStorageSvc.set(DatastoreKeys.InitParam, JSON.stringify(apexParams));
      component.ngOnInit();
      const initParam = ApexParams.init();
      expect(initParam.icRememberMe).toBe(false);
    });
    it('auto authenticate if icRememberMe is true and icUsername is not empty', () => {
      apexParams.icRememberMe = true;
      sessionStorageSvc.set(DatastoreKeys.InitParam, JSON.stringify(apexParams));
      component.ngOnInit();
      const initParam = ApexParams.init();
      expect(initParam.icRememberMe).toBe(true);
    });
  });

  describe('canDisableSignIn', () => {
    let username;
    let password;
    const usernameCtrl = 'username';
    const pwdCtrl = 'password';
    beforeEach(() => {
      username = component.loginForm.controls[usernameCtrl];
      password = component.loginForm.controls[pwdCtrl];
      username.setValue('test@hc8.com');
      password.setValue('test');
    });
    it('enable Sign In button if both username and password are not empty and username in valid email format', () => {
      expect(component.canDisableSignIn()).toBe(false);
    });
    it('disable Sign In button if username is empty', () => {
      username.setValue('');
      expect(component.canDisableSignIn()).toBe(true);
    });
    it('disable Sign In button if password is empty', () => {
      password.setValue('');
      expect(component.canDisableSignIn()).toBe(true);
    });
    it('disable Sign In button if both username and password are empty', () => {
      username.setValue('');
      password.setValue('');
      expect(component.canDisableSignIn()).toBe(true);
    });
  });

  describe('UserHub authenticate agent - ', () => {
    it('Verify whether "isUserHub" is true or not', async(() => {
      localStorageSvc.remove(DatastoreKeys.AuthSettings);
      sessionStorageSvc.remove(DatastoreKeys.QueryString);
      sforce.opencti.testing = 'success-userhub';
      const redirecturl = 'redirectToLoginPage';
      spyOn<any>(component, 'redirectToLoginPage');
      component.ngOnInit();
      setTimeout(() => {
        expect(component[redirecturl]).toHaveBeenCalled();
      });
    }));
  });
});
