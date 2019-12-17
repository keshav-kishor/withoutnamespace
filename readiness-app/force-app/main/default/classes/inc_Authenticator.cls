global with sharing class inc_Authenticator {
	private static CustomLogger logger = new CustomLogger('inc_Authenticator');
    //public static string namespacePrefix = 'inc_EinsteinApp';
    public static string namespacePrefix = '';
    
    /* Generate access_token and refresh_token from CXone for the userName and password received from authenticate page */
    webService static String authenticateUser(String username, String password, String uhUrl) {
        logger.addLog(CustomLogger.logLevel.TRACE, 'authenticateUser', 'METHOD ENTRY');
        DataModels.ApiResponse res = new DataModels.ApiResponse();
        try {
            username = EncodingUtil.urlDecode(username, 'UTF-8');
            password = EncodingUtil.urlDecode(password, 'UTF-8');
            logger.addLog(CustomLogger.logLevel.DEBUG, 'authenticateUser', 'PARAMs username:'+ username + ' password:'+ password );
            String payloadData='';
            logger.addLog(CustomLogger.logLevel.DEBUG, 'authenticateUser', 'Authenticating to inContact...');
 
            payloadData = '{"grant_type": "password", "username":"' + username + '", "password":"' + password + '", "scope": "RealTimeApi ChatApi CustomApi AdminApi AgentApi ReportingApi"}';
        
   			inc_AuthenticationSettings authSettings = new inc_AuthenticationSettings(Userinfo.getUserId());
            String authUrl = authSettings.authUrl != null?authSettings.authUrl : 'https://api.nice-incontact.com/InContactAuthorizationServer/Token';
            logger.addLog(CustomLogger.logLevel.DEBUG, 'authenticateUser', 'authUrl:' + authUrl);
            HttpUtil httpEngine = new HttpUtil(authUrl, AppConfig.getICBasicAuthorization(), logger);
            DataModels.ApiResponse apiResponse = httpEngine.doPost(payloadData);
            res.statusCode = apiResponse.statusCode;
            if(res.statusCode == 200) {
                res.error = '';
                Map<String, Object> maptest = new Map<String, Object>();
                System.debug('resourceUrl__c  '+ apiResponse.data);
                Map<String, Object> data = (Map<String, Object>)JSON.deserializeUntyped(apiResponse.data);
                System.debug('resourceUrl__c1  '+ data.get('resource_server_base_uri').toString());
                maptest.put('resourceUrl__c', data.get('resource_server_base_uri').toString());
                maptest.put('UH_Base_URL__c', uhUrl!='Central'?uhUrl:'');
                if(!Test.isRunningTest()) {
                    inc_CreateUpdateMetadataUtils.createUpdateMetadata('inc_APIUser_Keys.inContact','incontact',maptest);
                }
            } else {
               res.error = apiResponse.error; 
            }
            
            res.data = JSON.serialize(apiResponse.data);
            return JSON.serialize(res);
        }
        catch(Exception ex) {
            res.statusCode = 401;
            res.error = ex.getMessage();
            logger.addLog(CustomLogger.logLevel.ERROR, 'authenticateUser', 'EXCEPTION with message: ' + ex.getMessage() + ', \n stackTrace :' + ex.getStackTraceString());
       		return JSON.serialize(res);
        } finally {
            logger.addLog(CustomLogger.logLevel.TRACE, 'authenticateUser', 'METHOD EXIT');
            logger.saveLog();
        }
    }
    
    /* Stores accessKey and access secret in custom metadata settings, that can be used for obtaining access and refresh token for report api calls */
    webService static String storeAccessKeySecret (String accessKeyId, String accessKeySecret){
        logger.addLog(CustomLogger.logLevel.TRACE, 'storeAccessKeySecret', 'METHOD ENTRY');
        DataModels.RunApexResponse res = new DataModels.RunApexResponse();
        try {
            accessKeyId = EncodingUtil.urlDecode(accessKeyId, 'UTF-8');
            accessKeySecret = EncodingUtil.urlDecode(accessKeySecret, 'UTF-8');
            logger.addLog(CustomLogger.logLevel.DEBUG, 'storeUserCredentials', 'PARAM: accessKeyId: ' + accessKeyId + ' accessKeySecret: '+ accessKeySecret);

            Blob key = Blob.valueOf('inContactEinsApp');
            Blob accessKeyIdCipher = Crypto.encryptWithManagedIV('AES128', key, Blob.valueOf(accessKeyId));
            Blob accessKeySecretCipher = Crypto.encryptWithManagedIV('AES128', key, Blob.valueOf(accessKeySecret));
            
            Map<String, Object> maptest = new Map<String, Object>();
            maptest.put('accessKeyId__c', EncodingUtil.base64Encode(accessKeyIdCipher));
            maptest.put('accessKeySecret__c', EncodingUtil.base64Encode(accessKeySecretCipher));
            
            if(!Test.isRunningTest()) {
            	inc_CreateUpdateMetadataUtils.createUpdateMetadata('inc_APIUser_Keys.inContact','incontact',maptest);
            }
            res.success = 'true';
            logger.addLog(CustomLogger.logLevel.INFO, 'storeAccessKeySecret', 'SUCCESS: Access keys added successfully');
            return JSON.serialize(res);
        }
        catch(Exception ex) {
            res.success = 'false';
            res.error = ex.getMessage();
            logger.addLog(CustomLogger.logLevel.ERROR, 'storeAccessKeySecret', 'EXCEPTION with message :' + ex.getMessage() + ' \n stackTrace:' + ex.getStackTraceString());
            return JSON.serialize(res);
        } finally{
            logger.addLog(CustomLogger.logLevel.TRACE, 'storeUserCredentials', 'METHOD EXIT');
            logger.saveLog();
        }
    }
}