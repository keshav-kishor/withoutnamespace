export class AuthenticateSettings {
    isUserHub = false;
    userHubLoginBaseUrl = 'https://auth.nice-incontact.com';
    userHubNotificationUrl = 'https://na1-ws.nice-incontact.com/ws/notifications';
    userHubWebBaseUrl = 'https://na1.nice-incontact.com';
    centralTokenUrl = 'https://api.incontact.com/InContactAuthorizationServer/Token';
    centralMyDomain = '';
    forgotPassword = '';
    resourceServerBaseURI = '';

    // parse response from getCallCenterSettings and return AuthenticateSettings
   parseAuthenticationSettings(data: any) {
    const settings = new AuthenticateSettings();
    const authSettings = data;
    const icAuthUrl = (authSettings.icAuthorizationUrl__c) ? authSettings.icAuthorizationUrl__c : authSettings.icAuthorizationUrl__c;
    const authMode = authSettings.authMode__c ? authSettings.authMode__c : 'inContact';
    settings.centralTokenUrl = icAuthUrl ? icAuthUrl : authSettings.inContactTokenServiceUri__c;
    settings.isUserHub = (authMode && authMode.toLowerCase() === 'evolve' || authMode.toLowerCase() === 'userhub');
    settings.userHubLoginBaseUrl = (authSettings.evolveAuthUrl__c) ? authSettings.evolveAuthUrl__c : authSettings.evolveAuthUrl__c;
    settings.userHubNotificationUrl = (authSettings.evolveNotificationUrl__c) ? authSettings.evolveNotificationUrl__c
                                        : authSettings.evolveNotificationUrl__c;
    settings.userHubWebBaseUrl = (authSettings.evolveWebServerUrl__c) ? authSettings.evolveWebServerUrl__c
                                        : authSettings.evolveWebServerUrl__c;
    settings.centralMyDomain = (authSettings.icCustomDomain__c) ? authSettings.icCustomDomain__c : authSettings.icCustomDomain__c;
    settings.forgotPassword = (authSettings.forgotPassword__c) ? authSettings.forgotPassword__c : authSettings.forgotPassword__c;
    return settings;
  }
}
