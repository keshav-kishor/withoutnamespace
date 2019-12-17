@isTest
public with sharing class inc_Authenticator_Test {

    static testMethod void testAuthenticateUserTrue() {
        Integer expected = 200;
        
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '200');
        HttpResponse resp = new HttpResponse();
        resp.setBody('{\"resource_server_base_uri\":\"sampleUrl\"}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(200, 'SUCCESS', body, resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        
        Test.startTest();
        String response = inc_Authenticator.authenticateUser('userName', 'Password', 'Central');
        DataModels.ApiResponse actual = (DataModels.ApiResponse) JSON.deserialize(response, DataModels.ApiResponse.class);
        system.debug('>> '+actual);
        Test.stopTest();
       
        System.assertEquals(expected, actual.StatusCode);
    }
    static testMethod void testAuthenticateUserFalse() {
        Integer expected = 401;
        
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '401');
        HttpResponse resp = new HttpResponse();
        resp.setBody('{\"resource_server_base_uri\":\"sampleUrl\"}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(200, 'SUCCESS', body, resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        
        Test.startTest();
        String response = inc_Authenticator.authenticateUser('accessKe%$64yI+=)d', 'Password', 'Central');
        DataModels.ApiResponse actual = (DataModels.ApiResponse) JSON.deserialize(response, DataModels.ApiResponse.class);
        system.debug('>> '+actual);
        Test.stopTest();
       
        System.assertEquals(expected, actual.StatusCode);
    }
    
    static testMethod void testStoreAccessKeySecretTrue() {
        String expected = 'true';
        
        Test.startTest();
        String response = inc_Authenticator.storeAccessKeySecret('accessKeyId', 'accessKeySecret');
        DataModels.RunApexResponse actual = (DataModels.RunApexResponse) JSON.deserialize(response, DataModels.RunApexResponse.class);
        system.debug('>> '+actual);
        Test.stopTest();
       
        System.assertEquals(expected, actual.success);
    }
    static testMethod void testStoreAccessKeySecretFalse() {
        String expected = 'false';
        
        Test.startTest();
        String response = inc_Authenticator.storeAccessKeySecret('accessKe%$64yI+=)d', 'accessKeySecret');
        DataModels.RunApexResponse actual = (DataModels.RunApexResponse) JSON.deserialize(response, DataModels.RunApexResponse.class);
        system.debug('>> '+actual);
        Test.stopTest();
       
        System.assertEquals(expected, actual.success);
    }
}