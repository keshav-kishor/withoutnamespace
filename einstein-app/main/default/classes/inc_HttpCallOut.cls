public with sharing class inc_HttpCallOut {
    private static CustomLogger logger = new CustomLogger('inc_HttpCallOut');
    public static Map<String,Object> httpCallOutJSOFunction(Id recId, String baseUrl, String reportUrl, String method, Integer top, Integer skip){
       // String  accessToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjQ1OTQ2ODUsIm5hbWUiOiJBRWluc3RlaW5AYjIuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGkuaW5jb250YWN0LmNvbSIsInN1YiI6InVzZXI6NzE2NTIwNyIsImF1ZCI6ImluQ29udGFjdCBTdHVkaW9AaW5Db250YWN0IEluYy4iLCJleHAiOjE1NzQ4NTUyNTYsImlhdCI6MTU3NDg1MTY1NiwiaWNTY29wZSI6IjEsMiw0LDUsNyw4IiwiaWNDbHVzdGVySWQiOiJCMiIsImljQWdlbnRJZCI6NzE2NTIwNywiaWNTUElkIjoxNjUzLCJuYmYiOjE1NzQ4NTE2NTZ9.ovNAXsh0OSOYlN6eUgMNfxbHKwaFKGFOWUpJXB5MkhuYb9lPSZlhbURc2BvCB4XzZYSKsbdImS5Izy8ByyAvXo0oLLU2GZqf9iSbrU0TPAlXk1NX2HOUnJz4VEiSY-j0RZZgLryXpgrhIOp7j-xdZZDw2jeMsigW5GYs0nkrt3A1s_BZtHXpls5S9ACdQXNcCMTgSYp7-7UIYiZ9X3LpGelsA_SPTdWqse9sr8eRTw0Wz3Sq550aksj6ruyDp8J-l8TzO-MVwZkvHRL78KDWS2llNySbBD9vs0jGgmkFnWdctL_N0XiTC65Bo2gnSlnoZZ5yAsdEtfxL57JNFJuo_A';
        //return httpCallOutJSOFunction(recId, baseUrl, reportUrl, method, accessToken, top, skip);
        if(isTokenExpired()) {
            system.debug('######token Expired######');
            String response = generateAccessToken();
            if(response == 'SUCCESS') {
                system.debug('######new token generated########');
                inc_User_Token__c authToken = [select access_token__c,expires_in__c from inc_User_Token__c limit 1];
                return httpCallOutJSOFunction(recId, baseUrl, reportUrl, method, authToken.access_token__c, top, skip);
                
            } else {
                 Map<String,Object> resMap = new Map<String,Object>();
                 resMap.put('SUCCESS', false);
                 return resMap;
            }
        } else {
            system.debug('#####token not Expired#####');
            inc_User_Token__c authToken = [select access_token__c,expires_in__c from inc_User_Token__c limit 1];
            return httpCallOutJSOFunction(recId, baseUrl, reportUrl, method, authToken.access_token__c, top, skip);
        }
            
        }
    

    public static Map<String,Object> httpCallOutJSOFunction(Id recId, String baseUrl, String reportUrl, String method, String accessToken, Integer top, Integer skip){
        Map<String,Object> resMap = new Map<String,Object>();
        Boolean isSuccess = false;
        Http http = new Http();
        HttpRequest request = new HttpRequest();

        //baseUrl = 'https://api-do73.dev.nice-incontact.com/InContactAPI/';
        //reportUrl= '/services/v10.0/report-jobs/datadownload/508';
        if(method == 'GET'){
                    List<InContact_Reports__mdt> reportData = [SELECT Id, fields__c, startDate__c, endDate__c  FROM InContact_Reports__mdt WHERE Id = :recId];
            if(!reportData.isEmpty()){
                if(reportData[0].startDate__c!=null)
            reportUrl = reportUrl +'?'+'startDate' + '='+EncodingUtil.urlEncode(reportData[0].startDate__c, 'UTF-8') ;
                if(reportData[0].endDate__c!=null)
                reportUrl = reportUrl + '&'+'endDate' + '='+EncodingUtil.urlEncode(reportData[0].endDate__c, 'UTF-8');
                if(reportData[0].fields__c!=null)
            reportUrl = reportUrl + '&'+'fields' + '='+EncodingUtil.urlEncode(reportData[0].fields__c, 'UTF-8');
                reportUrl = reportUrl+ + '&top='+ string.valueOf(top) +'&skip='+ string.valueOf(skip)  ;
            }
        }
      // baseUrl = 'https://api-b2.incontact.com/inContactAPI/';
        request.setEndpoint(baseUrl + reportUrl);
        
        /* if(method == 'POST'){
            
            JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            gen.writeStringField('saveAsFile', 'false');
            gen.writeStringField('fileName', 'download.csv');
            gen.writeStringField('includeHeaders', 'true');
            for(Report_filter__c filter : [SELECT Id, Name,Description__c, Value__c FROM Report_filter__c 
                                           WHERE InContact_Report__c=:recId ]){
                                               gen.writeStringField(filter.Name, filter.value__c);
                                           }
 
            gen.writeEndObject();
            
            // Get the JSON string.
            String reqString = gen.getAsString();
            system.debug('reqString===='+reqString);
            request.setBody(reqString);
        } */
        request.setMethod(method);
        
        accessToken = 'bearer ' + accessToken;
        system.debug('Access Token **** '+accessToken);
        request.setHeader('Authorization', accessToken);
        request.setTimeout(30000);
        request.setHeader('content-Type', 'application/json; charset=UTF-8');
        request.setHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
        HttpResponse response = http.send(request);
        system.debug('response === '+response);
        //Add refresh token code if token expires
        // If the request is successful, parse the JSON response.
       Transient Blob fileData;
       Transient String fileStr;
        if (response.getStatusCode() == 200) {
            isSuccess = true;
            system.debug('response.getBody() ====== '+ response.getBody());
            // Deserialize the JSON string into collections of primitive data types.
            Transient Map<String, Object> results = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            Transient String kStr = '';
            for(String keyStr : results.keyset()){
                kStr = keyStr;
            }
           // system.debug('kStr === '+ kStr);
            
           // system.debug('kStr === '+ kStr);
            
            if(!results.containsKey('file')){
                Transient List<object> objList = (List<object>)results.get(kStr);
                // system.debug('objList === '+objList);
                fileStr = JSON.serialize(objList);
                //system.debug('fileStr === '+ fileStr);
                fileStr = jsonToCSVConvertor(fileStr);
                //system.debug('fileStr 2=== '+ fileStr);
               resMap.put('DATAStr', fileStr);
            }else{
                Transient String resFile = (String)results.get('file');
                //system.debug('resFile ==== '+ resFile);
                resMap.put('DATABlob', resFile);
            }  
        }else{
            
            resMap.put('DATA', response.getStatus());
            system.debug('results === '+ response.getStatus());
            
        }
        
        resMap.put('SUCCESS', isSuccess);
        return resMap;
    }
    
    public static String jsonToCSVConvertor(String s) {
        String csvFile = '';
        List<Object> entryList = (List<Object>) JSON.deserializeUntyped(s);
        
        List<Map<String, Object>> mapList = new List<Map<String, Object>>();
        Set<String> keySet = new Set<String>();
        
        for (Object entry : entryList) {
            Map<String, Object> m = (Map<String, Object>)(entry);
            keySet.addAll(m.keySet());
            mapList.add(m);
        }
        system.debug('mapList === '+ mapList);
        List<String> keys = new List<String>(keySet);
        keys.sort();
        
        List<List<String>> csvLines = new List<List<String>>();
        
        for (Integer i = 0; i <= mapList.size(); i++) {
            csvLines.add(new List<String>());
        }
        
        for (String key : keys) {
            csvLines.get(0).add('"' + key + '"');
            
            for (Integer i = 1; i <= mapList.size(); i++) {
                csvLines.get(i).add('"' + String.valueOf(mapList.get(i - 1).get(key)) + '"');
            }
        }
        
        
        for (List<String> csvLine : csvLines) {
            String line = '';
            for (Integer i = 0; i < csvLine.size() - 1; i++) {
                line += csvLine.get(i) + ',';
            }
            line += csvLine.get(csvLine.size() - 1);
            csvFile += line + '\n';
        }
        //System.debug('csvFile' + csvFile);
        system.debug('csvLines === '+ csvLines.size());
        csvFile = csvFile.remove('"');
        return csvFile;  
    }
    
    private static Boolean isTokenExpired() {
        inc_User_Token__c[] authToken = [select access_token__c,expires_in__c,accessTokenTime__c from inc_User_Token__c limit 1];
        if(authToken.isEmpty()){
            return true;
        } else if(authToken.get(0).accessTokenTime__c == null || authToken.get(0).expires_in__c == null) {
            return true;
        }
        return ((DateTime.now().getTime() - authToken.get(0).accessTokenTime__c) / 1000) >= (authToken.get(0).expires_in__c - (2 * 60));
    }
    
   private static String generateAccessToken() {
        logger.addLog(CustomLogger.logLevel.TRACE, 'generateAccessToken', 'METHOD ENTRY');
        try {
            inc_APIUser_Keys__mdt[] data = [SELECT accessKeyId__c, accessKeySecret__c, resourceUrl__c, UH_Base_URL__c  FROM inc_APIUser_Keys__mdt WHERE DeveloperName = 'inContact'];
            String tokenURL = '';
            String accessKeyId = '';
            String accessKeySecret = ''; 
            if (!data.isEmpty()) {
               Blob key = Blob.valueOf('inContactEinsApp');
               Blob encodedEncryptedAccessKeyId = EncodingUtil.base64Decode(data.get(0).accessKeyId__c);
               Blob encodedEncryptedAccessKeySecret = EncodingUtil.base64Decode(data.get(0).accessKeySecret__c);
               Blob decryptedAccessKeyId = Crypto.decryptWithManagedIV('AES128', key, encodedEncryptedAccessKeyId);
               Blob decryptedAccessKeySecret = Crypto.decryptWithManagedIV('AES128', key, encodedEncryptedAccessKeySecret);

               accessKeyId = decryptedAccessKeyId.toString();
               accessKeySecret = decryptedAccessKeySecret.toString(); 
               String resourceURL = data.get(0).resourceUrl__c;
               String uhBaseURL = data.get(0).UH_Base_URL__c;
                if(uhBaseURL != null) {
                    tokenURL = uhBaseURL + '/authentication/v1/token/access-key';
                } else {
                    tokenURL = resourceURL.remove('/InContactAPI') + '/InContactAuthorizationServer/Token/access-key';
                }
            }
            String payloadData='{"accessKeyId":"'+accessKeyId+'","accessKeySecret":"'+accessKeySecret+'"}';                           
            logger.addLog(CustomLogger.logLevel.DEBUG, 'generateAccessToken', 'payloadData:' + payloadData);
            HttpUtil httpEngine = new HttpUtil(tokenURL, logger);
            DataModels.ApiResponse apiResponse = httpEngine.doPost(payloadData);
            logger.addLog(CustomLogger.logLevel.DEBUG, 'generateAccessToken', 'response:' + JSON.serialize(apiResponse));
            if(apiResponse.statusCode == 200) {
                Map<String, Object> res = (Map<String, Object>)JSON.deserializeUntyped(apiResponse.data);
                System.debug('res ===== ' + res + 'accesstoken:: '+ res.get('access_token').toString());
                
                saveUserTokens(res.get('access_token').toString(), Integer.valueOf(res.get('expires_in')), true);
                
                return 'SUCCESS';
            } else {
                saveUserTokens('', 0, false);
                return '';
            }
        }
        catch(Exception ex) {
            logger.addLog(CustomLogger.logLevel.ERROR, 'generateAccessToken', 'EXCEPTION with message: ' + ex.getMessage() + ', \n stackTrace :' + ex.getStackTraceString());
        } finally {
            logger.addLog(CustomLogger.logLevel.TRACE, 'generateAccessToken', 'METHOD EXIT');
            logger.saveLog();
        }
        return '';
    }
    
    @future
    private static void saveUserTokens(String accessToken, Integer expiresIn, Boolean isSuccess) {
       // Schema.DescribeSObjectResult s = inc_User_Token__c.sObjectType.getDescribe();
        // Boolean isCreateable = s.isCreateable();
        inc_User_Token__c[] userToken = [SELECT access_token__c, expires_in__c FROM inc_User_Token__c limit 1];
            if(Schema.sObjectType.inc_User_Token__c.fields.access_token__c.isCreateable() && 
                Schema.sObjectType.inc_User_Token__c.fields.access_token__c.isUpdateable()  &&  
                Schema.sObjectType.inc_User_Token__c.fields.expires_in__c.isCreateable()  && 
                Schema.sObjectType.inc_User_Token__c.fields.expires_in__c.isUpdateable() && 
                Schema.sObjectType.inc_User_Token__c.fields.accessTokenTime__c.isCreateable()  && 
                Schema.sObjectType.inc_User_Token__c.fields.accessTokenTime__c.isUpdateable() &&
              	Schema.sObjectType.inc_User_Token__c.fields.Is_Authentication_Successful__c.isUpdateable() &&
              	Schema.sObjectType.inc_User_Token__c.fields.Is_Authentication_Successful__c.isCreateable()){
                    if(userToken.size() > 0 )  {
                        
                            userToken[0].access_token__c = accessToken;
                            userToken[0].expires_in__c = expiresIn;
                            userToken[0].accessTokenTime__c = DateTime.now().getTime();
                                userToken[0].Is_Authentication_Successful__c = isSuccess;
                            upsert userToken;
                            system.debug('#########token updated############');
                        
                    } else {
                        inc_User_Token__c userTokenNew = new inc_User_Token__c();
                        if(Schema.sObjectType.inc_User_Token__c.isCreateable()){
                            userTokenNew.access_token__c = accessToken;
                            userTokenNew.expires_in__c = expiresIn;
                            userTokenNew.accessTokenTime__c = DateTime.now().getTime();
                            userTokenNew.Is_Authentication_Successful__c = isSuccess;
                            insert userTokenNew;
                            system.debug('#########token inserted############');
                        }
                    }
                }
    }
    
}