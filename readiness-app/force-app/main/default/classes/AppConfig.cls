public with sharing class AppConfig {
   
    public static String getICBasicAuthorization() {
        String appIdSecret = getICAppIdSecret();
        return ('Basic ' + EncodingUtil.base64Encode(Blob.valueof(appIdSecret)));
    }

    private static String getICAppIdSecret() {
        Einstein_App_Config_Internal__mdt[] data = [SELECT DeveloperName, AppId__c, AppSecret__c  FROM Einstein_App_Config_Internal__mdt WHERE DeveloperName = 'inContact'];
        if (data.isEmpty()) {
            return ('');
        } else {
            return (data.get(0).AppId__c + ':' + data.get(0).AppSecret__c);
        }
    }
}