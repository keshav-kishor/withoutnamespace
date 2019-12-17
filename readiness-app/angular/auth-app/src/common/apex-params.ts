import { SessionStorageService, DatastoreKeys } from 'common-lib';

export class ApexParams {
    icUsername: string;
    icRememberMe: boolean;
    authCallbackUrl: string;
    authenticatorService = 'inc_Authenticator';
    langCode: string;
    resourceBase: string;
    sfSessionId: string;
    namespacePrefix: string;
    
    static init(): ApexParams {
        const sessionStorageSvc = new SessionStorageService();
        const param = new ApexParams();
        // this value set from Visualforce / HTML page
        const params = sessionStorageSvc.get(DatastoreKeys.InitParam);
        if (params) {
            const obj = JSON.parse(params);
            param.icUsername = obj.icUsername;
            param.icRememberMe = obj.icRememberMe ? JSON.parse(obj.icRememberMe) : false; // convert string to boolean
            param.authCallbackUrl = obj.authCallbackUrl;
            param.langCode = obj.langCode;
            param.resourceBase = obj.resourceBase;
            param.sfSessionId = obj.sfSessionId;
            param.namespacePrefix = obj.namespacePrefix;
            if (obj.namespacePrefix !== '') {
                param.authenticatorService = obj.namespacePrefix + '.' + param.authenticatorService;
            }
        } else {
            param.langCode = 'en_US';
            param.resourceBase = '.';
        }
        return param;
    }
}
