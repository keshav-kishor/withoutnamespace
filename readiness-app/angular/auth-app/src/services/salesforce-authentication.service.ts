declare var sforce: any;

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { OpenIDConfig } from '../model/open-id-config.model';
import { ApexParams } from '../common/apex-params';
import { AuthToken, SalesforceResponse, ValidationUtilsService, LoggerService, AuthenticateSettings, AccessTokenService } from 'common-lib';
import { throwError } from 'rxjs';

import { HttpWrapperService } from './http-wrapper.service';
import {	LocalStorageService, DatastoreKeys} from 'common-lib';

@Injectable({
  providedIn: 'root'
})

export class SalesforceAuthenticationService implements AuthenticationService {
  invalidCredentialsMsg: string;
  accountLockedMsg: string;
  accountLockedMsgFromAPI: string;
  initParam: ApexParams;
  private authSettings: AuthenticateSettings;

  private userRegisterUriUH = '/user/register';
  private accessKeyUriUH = '/access-key-management/v1/access-keys';
  private userRegisterUriCentral = 'services/v16.0/agents';
  private accessKeyUriCentral = 'services/V15.0/access-keys';
  private getTenantIdUri = 'services/v13.0/business-unit';
  private userActivateUriUH = '/user/invite';


  constructor(private http: HttpClient, private httpWrapper: HttpWrapperService, private validationUtilSvc: ValidationUtilsService, private logger: LoggerService,
    private localStorageSvc: LocalStorageService, private accessTokenSrv: AccessTokenService
    ) {
    this.invalidCredentialsMsg = 'You have entered a wrong username or password';
    this.accountLockedMsg = 'For security reasons, your account is locked. Please contact your manager to unlock your account.';
    this.accountLockedMsgFromAPI = 'Login failed. The account has been locked. Contact your system administrator.';
    this.initParam = ApexParams.init();
  }
  /* New Changes starts here */

  authenticateUser(userName: string, password: string, uhUrl: string) {
    return new Promise((resolve, reject) => {
      const initParam = ApexParams.init();
      sforce.apex.execute(initParam.authenticatorService, 'authenticateUser',
        { 'username': encodeURIComponent(userName), 'password': encodeURIComponent(password), 'uhUrl': uhUrl },
        (response) => {
          try {
            const responseObj = JSON.parse(response);
            if (responseObj.statusCode === 200) {
              this.logger.debug(SalesforceAuthenticationService.name, 'authenticate response : ' + responseObj.data);
              const authToken = new AuthToken();
              authToken.parseData(JSON.parse(JSON.parse(responseObj.data)));
              resolve(authToken);
            } else {
              this.logger.debug(SalesforceAuthenticationService.name, 'authenticate<<error: ' + response);
              reject(JSON.parse(JSON.parse(responseObj.data)).error_description || responseObj.error);
            }
          } catch (error) {
            this.logger.error(SalesforceAuthenticationService.name, 'authenticate<<exception : ' + JSON.stringify(error));
            reject(error);
          }
        });
    });
  }

  getTenatId() {
    const authSetting = this.localStorageSvc.get(DatastoreKeys.AuthSettings);
    this.authSettings = JSON.parse(authSetting);
    const params = '?fields=tenantId';
    const url = this.accessTokenSrv.getAccessToken().resourceUrl + this.getTenantIdUri + params;

    return new Promise((resolve, reject) => {
      this.httpWrapper.get(url).toPromise().then((response: any) => {
        this.logger.debug(SalesforceAuthenticationService.name, 'getTenatId - success: ' + response);
        resolve(response.businessUnits[0]);
      }, (error) => {
        this.logger.error(SalesforceAuthenticationService.name, 'getTenatId - failed: ' + error);
        reject(error);
      });
    });
  }

  getAgentInfo(userName: string) {
    const authSetting = this.localStorageSvc.get(DatastoreKeys.AuthSettings);
    this.authSettings = JSON.parse(authSetting);
    const params = '?isActive=true&searchString=' + userName + '&fields=agentId,userName,emailAddress,teamId,profileId,country,city,timeZone,state';
    const url = this.accessTokenSrv.getAccessToken().resourceUrl + this.userRegisterUriCentral + params;
  

    return new Promise((resolve, reject) => {
      this.httpWrapper.get(url).toPromise().then((response: any) => {
        this.logger.debug(SalesforceAuthenticationService.name, 'getAgentInfo - success: ' + response);
        resolve(response.agents[0]);
      }, (error) => {
        this.logger.error(SalesforceAuthenticationService.name, 'getAgentInfo - failed: ' + error);
        reject(error);
      });
    });
  }

  getUserInfo(userName: string) {
    const url = this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl) + '/user';
    const adminUserName = this.localStorageSvc.get(DatastoreKeys.AdminUserName).toLowerCase();
		return new Promise((resolve, reject) => {
			this.httpWrapper.get(url).toPromise().then((response: any) => {
        const users = response.users.filter(function (entry) { return entry.userName === userName.toLowerCase(); });
        let userId = '';
        let status = 'ACTIVE';
        if(users.length == 1) {
          userId = users[0].id;
          status = users[0].status;
          this.logger.debug(SalesforceAuthenticationService.name, 'getUser - success: ' + userId);
        }
				const adminUser = response.users.filter(function (entry) { return entry.userName === adminUserName; })[0];
        const res = {
          "NewUserId" : userId,
          "adminUser" : adminUser,
          "status" : status
        }
				resolve(res);
			}, (error) => {
				this.logger.error(SalesforceAuthenticationService.name, 'getUser - failed: ' + error);
				reject(error);
			});
		});
  }
  
  activateUser(emailAddressesList: string, senderEmail: string) {
    const url = this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl) + this.userActivateUriUH;
    const payload = {
                      "emailAddressesList" : [emailAddressesList],
                      "senderEmail" : senderEmail
                    };
    return new Promise((resolve, reject) => {
      this.httpWrapper.post(url, payload).toPromise().then((response: any) => {
        this.logger.debug(SalesforceAuthenticationService.name, 'activateUser - success: ' + response);
        resolve(response);
      }, (error) => {
        this.logger.error(SalesforceAuthenticationService.name, 'activateUser - failed: ' + error);
        reject(error);
      });
    });
  }

  userRegistration(payload: any, evolveWebServerUrl: string) {
    let url = '';
    if (evolveWebServerUrl !== 'Central'){
      url = url + evolveWebServerUrl + this.userRegisterUriUH;
    } else {
      url = url + this.accessTokenSrv.getAccessToken().resourceUrl + this.userRegisterUriCentral;
    }
    return new Promise((resolve, reject) => {
      this.httpWrapper.post(url, payload).toPromise().then((response: any) => {
        this.logger.debug(SalesforceAuthenticationService.name, 'userRegistration - success: ' + response);
        resolve(response);
      }, (error) => {
        this.logger.error(SalesforceAuthenticationService.name, 'userRegistration - failed: ' + error);
        reject(error);
      });
    });
  }
  
  createAccessKeyAPI(evolveWebServerUrl: string) {
    let url = '';
    let payload = {};
    if (evolveWebServerUrl !== 'Central'){
      url = url + evolveWebServerUrl + this.accessKeyUriUH;
      payload = {
        "userId": this.localStorageSvc.get(DatastoreKeys.NewUserId),
        "tenantId" : this.localStorageSvc.get(DatastoreKeys.TenantId)
      };
    } else {
      url = url + this.accessTokenSrv.getAccessToken().resourceUrl + this.accessKeyUriCentral;
      payload = {
        "agentId": parseInt(this.localStorageSvc.get(DatastoreKeys.NewUserId))
      };
    }
   
    return new Promise((resolve, reject) => {
      this.httpWrapper.post(url, payload).toPromise().then((response: any) => {
        this.logger.debug(SalesforceAuthenticationService.name, 'createAccessKeyAPI - success: ' + response);
        resolve(response);
      }, (error) => {
        this.logger.error(SalesforceAuthenticationService.name, 'createAccessKeyAPI - failed: ' + error);
        reject(error);
      });
    });
  }
  storeAccessAndSecretKey() {
    this.logger.log(SalesforceAuthenticationService.name, 'storeAccessKeySecret');
    return new Promise((resolve, reject) => {
      try {
        const initParam1 = ApexParams.init();
        const accessKeySec = JSON.parse(this.localStorageSvc.get(DatastoreKeys.AccessSecretKey));
        sforce.apex.execute( initParam1.authenticatorService, 'storeAccessKeySecret',
          {'accessKeyId' : encodeURIComponent(accessKeySec.accessKey.accessKeyId),
          'accessKeySecret': encodeURIComponent(accessKeySec.accessKey.accessKeySecret)},
           (response) => {
            this.logger.debug(SalesforceAuthenticationService.name, 'storeAccessKeySecret - ' + JSON.stringify(response));
            const apexResponse = JSON.parse(response);
            if (apexResponse.success === 'true') {
              resolve(true);
            } else {
              reject(apexResponse.error);
            }
        });
      } catch (e) {
        this.logger.error(SalesforceAuthenticationService.name, 'Error in storeAccessKeySecret...' + e);
        reject(e.message);
      }
    });
  }

  /* New Changes ends here */

}
