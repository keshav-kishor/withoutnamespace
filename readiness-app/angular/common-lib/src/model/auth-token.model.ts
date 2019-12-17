export class AuthToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    accessTokenTime: number;
    resourceUrl: string;
    businessUnit: string;

    // parse access token response data for Central/Idp/UserHub
    parseData(data: any) {
        this.accessToken = (data.access_token) ? data.access_token : data.accessToken;
        this.refreshToken = (data.refresh_token) ? data.refresh_token : data.refreshToken;
        this.expiresIn = (data.expires_in) ? data.expires_in : data.accessTokenExpiry;
        this.accessTokenTime = new Date().getTime();
        this.resourceUrl = (data.resource_server_base_uri) ? data.resource_server_base_uri : data.resourceUrl;
        this.businessUnit = (data.bus_no) ? data.bus_no : data.businessUnit;
    }
}
