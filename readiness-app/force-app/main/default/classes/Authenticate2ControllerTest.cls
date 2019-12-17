@isTest 
public with sharing class Authenticate2ControllerTest {

    static testMethod void Validate_UserOptions() {

        String expectedLangCode = UserInfo.getLanguage();

        Authenticate2Controller target = null;
        Test.startTest();
            target = new Authenticate2Controller();
        Test.stopTest();
        System.assertEquals(expectedLangCode, target.langCode);
    }
}
