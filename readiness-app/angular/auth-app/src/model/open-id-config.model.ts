export class OpenIDConfig {
    openIdAuthorize: string;
    openIdClientId: string;
    busNo: string;
    icAuthorizationUrl: string;
    icAuthenticationEnabled: boolean;
    openIdAuthRequestParams: any;

    // parse Open Id configuration details
    parseOpenIDConfig(data: any) {
        this.openIdAuthorize = data.openIdAuthorize;
        this.openIdClientId = data.openIdClientId;
        this.busNo = data.bus_no;
        this.icAuthorizationUrl = data.icAuthorizationUrl;
        this.icAuthenticationEnabled = data.icAuthenticationEnabled;
        this.openIdAuthRequestParams = data.openIdAuthRequestParams;
    }
}
