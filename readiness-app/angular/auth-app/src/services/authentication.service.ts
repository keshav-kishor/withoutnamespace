export interface AuthenticationService {
    // new changes
    authenticateUser(userName: string, password: string, uhUrl);
    getTenatId();
    userRegistration(payload: any, evolveWebServerUrl: String);
    getAgentInfo(userName: string);
    getUserInfo(userName: string);
    createAccessKeyAPI(evolveWebServerUrl: String);
    storeAccessAndSecretKey();
    activateUser(emailAddressesList: string, senderEmail: string);
}
