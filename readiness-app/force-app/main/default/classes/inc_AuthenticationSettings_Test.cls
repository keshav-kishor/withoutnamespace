@isTest
public with sharing class inc_AuthenticationSettings_Test {
    
    static testmethod void testConstructor(){
        Test.startTest();
		inc_AuthenticationSettings authSettings = new inc_AuthenticationSettings(UserInfo.getUserId());
        System.assertNotEquals(null, authSettings);
      	Test.stopTest();  
    }
}