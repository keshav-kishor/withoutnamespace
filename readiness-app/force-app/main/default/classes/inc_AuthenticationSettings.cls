public with sharing class inc_AuthenticationSettings {
	private Authentication_Settings__c authSetting;
    public String authUrl { get; set; }

    public inc_AuthenticationSettings(string userId) {        
        authSetting = Authentication_Settings__c.getValues(userId);
        system.debug('authSetting  :: '+authSetting);
        if( authSetting == null ) {
            authSetting = new Authentication_Settings__c(SetupOwnerId = userId);
        }
        authUrl = authSetting.authUrl__c;
    } 
}