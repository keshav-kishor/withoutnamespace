@isTest
public class inc_EnqueueDataPartInsert_Test {
    
    @testSetup 
    static void setup() {
        inc_User_Token__c tokenObj = new inc_User_Token__c();
        tokenObj.access_token__c = 'sdfsdfsdfsdfsdfsdfdsf';
        tokenObj.expires_in__c = 3000000.00;
        tokenObj.Is_Authentication_Successful__c = true;
        tokenObj.accessTokenTime__c = DateTime.now().getTime() - 120000000;
        insert tokenObj;

    }
    
    
    static testmethod void inc_EnqueueDataPartInsertTest() {
        //startTest/stopTest block to force async processes to run in the test.
        //InsightsExternalData obj = [Select Id FROM InsightsExternalData LIMIT 1];
       InContact_Reports__mdt repdata = [SELECt Id FROM InContact_Reports__mdt LIMIT 1];
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '200');
        HttpResponse resp = new HttpResponse();
        resp.setBody('{"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3Q", "token_type": "Bearer","refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhcHBJZCI6IkFjY2Vzc0tleXNATklDRWluQ29udGFjdCBJbmMuIiwiaXNzIjoiaHR0cHM6XC9cL25hMS5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwibmFtZSI6ImtrazIzQGtrLmNvbSIsInR5cCI6IlJFRlJFU0giLCJzZXNzaW9uSWQiOiJ2ZUd6NGQ3NTg1NDNlOTYwNDY4ZDg0ODY1YTMwMzQ1ZDkwN2RmNEdiIiwiZXhwIjoxNTY5NTcxNTY3LCJpYXQiOjE1Njk1NjQzNjd9.a1cjH0iKqc8Ew0vRnx6gdQN9rvMLf6PCvN4rv132WlkPmEwZODyaazsm87VYZ3BOmgEMgJTcRZus14u6H8ssEYmY7qr5gJGJqNZ8abiyuKlx3Nvgh5Gmsdw318qus6b_epmGaAUn-6S__Of6hGSIYvXyv360vzYn4ZsyfmKFI-o","expires_in": 3600,"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3","businessUnitId":28,"lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"contactId":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        //resp.setBody('{"businessUnitId":28,"SUCCESS":true,lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"DATABlob":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(200, 'SUCCESS', resp.getBody(), resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        Test.startTest(); 
        
        InsightsExternalData sobj = new InsightsExternalData();
        //sobj.setType('InsightsExternalData'); 
        sobj.Format='Csv';
        sobj.EdgemartAlias = 'TestDataset';
        sobj.EdgemartContainer = 'Sales_Productivity';
        
        sobj.Operation = 'Overwrite';
        sobj.Action = 'None';
        insert sobj;
        System.assert(true);
        System.enqueueJob(new inc_EnqueueDataPartInsert(sobj.Id, repdata.Id, '', '', 'GET', ''));
        Test.stopTest();
        
    }
    static testmethod void inc_EnqueueDataPartInsertTestFail() {
        //startTest/stopTest block to force async processes to run in the test.
        //InsightsExternalData obj = [Select Id FROM InsightsExternalData LIMIT 1];
       InContact_Reports__mdt repdata = [SELECt Id FROM InContact_Reports__mdt LIMIT 1];
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '202');
        HttpResponse resp = new HttpResponse();
        resp.setBody('{"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3Q", "token_type": "Bearer","refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhcHBJZCI6IkFjY2Vzc0tleXNATklDRWluQ29udGFjdCBJbmMuIiwiaXNzIjoiaHR0cHM6XC9cL25hMS5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwibmFtZSI6ImtrazIzQGtrLmNvbSIsInR5cCI6IlJFRlJFU0giLCJzZXNzaW9uSWQiOiJ2ZUd6NGQ3NTg1NDNlOTYwNDY4ZDg0ODY1YTMwMzQ1ZDkwN2RmNEdiIiwiZXhwIjoxNTY5NTcxNTY3LCJpYXQiOjE1Njk1NjQzNjd9.a1cjH0iKqc8Ew0vRnx6gdQN9rvMLf6PCvN4rv132WlkPmEwZODyaazsm87VYZ3BOmgEMgJTcRZus14u6H8ssEYmY7qr5gJGJqNZ8abiyuKlx3Nvgh5Gmsdw318qus6b_epmGaAUn-6S__Of6hGSIYvXyv360vzYn4ZsyfmKFI-o","expires_in": 3600,"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3","businessUnitId":28,"lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"contactId":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        //resp.setBody('{"businessUnitId":28,"SUCCESS":true,lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"DATABlob":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(202, 'Fail', resp.getBodyAsBlob(), resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        Test.startTest(); 
        
        InsightsExternalData sobj = new InsightsExternalData();
        //sobj.setType('InsightsExternalData'); 
        sobj.Format='Csv';
        sobj.EdgemartAlias = 'TestDataset';
        sobj.EdgemartContainer = 'Sales_Productivity';
        
        sobj.Operation = 'Overwrite';
        sobj.Action = 'None';
        insert sobj;
        System.assert(true);
        System.enqueueJob(new inc_EnqueueDataPartInsert(sobj.Id, repdata.Id, '', '', 'GET', ''));
        Test.stopTest();
        
    }
    static testmethod void inc_ExceptionEnqueueDataPartInsertTest() {
        //startTest/stopTest block to force async processes to run in the test.
        //InsightsExternalData obj = [Select Id FROM InsightsExternalData LIMIT 1];
       InContact_Reports__mdt repdata = [SELECt Id FROM InContact_Reports__mdt LIMIT 1];
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '200');
        HttpResponse resp = new HttpResponse();
        //resp.setBody('{"id_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3Q", "token_type": "Bearer","refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhcHBJZCI6IkFjY2Vzc0tleXNATklDRWluQ29udGFjdCBJbmMuIiwiaXNzIjoiaHR0cHM6XC9cL25hMS5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwibmFtZSI6ImtrazIzQGtrLmNvbSIsInR5cCI6IlJFRlJFU0giLCJzZXNzaW9uSWQiOiJ2ZUd6NGQ3NTg1NDNlOTYwNDY4ZDg0ODY1YTMwMzQ1ZDkwN2RmNEdiIiwiZXhwIjoxNTY5NTcxNTY3LCJpYXQiOjE1Njk1NjQzNjd9.a1cjH0iKqc8Ew0vRnx6gdQN9rvMLf6PCvN4rv132WlkPmEwZODyaazsm87VYZ3BOmgEMgJTcRZus14u6H8ssEYmY7qr5gJGJqNZ8abiyuKlx3Nvgh5Gmsdw318qus6b_epmGaAUn-6S__Of6hGSIYvXyv360vzYn4ZsyfmKFI-o","expires_in": 3600,"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyOjExZTllMGUyLTBlOTYtYjdlMC1iZDkwLTAyNDJhYzExMDAwMiIsInJvbGUiOnsibGVnYWN5SWQiOiJFbXBsb3llZSIsInNlY29uZGFyeVJvbGVzIjpbXSwiaWQiOiIxMWU5N2NjMS0zNGNjLTU3MTAtYWJlOS0wMjQyYWMxMTAwMDMiLCJsYXN0VXBkYXRlVGltZSI6MTU2OTM5NDgyNTAwMH0sImljQWdlbnRJZCI6IjEwMTkiLCJpc3MiOiJodHRwczpcL1wvYXV0aC5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwiYXVkIjoiQWNjZXNzS2V5c0BOSUNFaW5Db250YWN0IEluYy4iLCJpY1NQSWQiOiIyNiIsImljQlVJZCI6OTgzNjQ3NSwibmFtZSI6ImtrazIzQGtrLmNvbSIsInRlbmFudElkIjoiMTFlOTdjYzEtMzIxNC1kODMwLTg4MGMtMDI0MmFjMTEwMDA1IiwiZXhwIjoxNTY5NTY3OTY3LCJpYXQiOjE1Njk1NjQzNjcsInRlbmFudCI6InBlcm1fZG83MzM3OTA2NDQ0IiwiaWNDbHVzdGVySWQiOiJkbzczIn0.c7FJLO8N_fcvOHCGhpsGX8mfRUuW21veftubMHGKhJUXoQhS54J7vXWG2IF1SvDUgp9JwHi9kQDxLHp-xJ3B_5fWNpikAngiYVANjr0t8__ph1q6aJDIEv2yojWUYm_3QSgbQOT6pHxmiUGs1WFv0HU6FPudgAIvHFyVo6m8M3","businessUnitId":28,"lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"contactId":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        resp.setBody('{"businessUnitId":28,"SUCCESS":true,lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"DATABlob":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(200, 'SUCCESS', body, resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        Test.startTest(); 
        
        InsightsExternalData sobj = new InsightsExternalData();
        //sobj.setType('InsightsExternalData'); 
        sobj.Format='Csv';
        sobj.EdgemartAlias = 'TestDataset';
        sobj.EdgemartContainer = 'Sales_Productivity';
        
        sobj.Operation = 'Overwrite';
        sobj.Action = 'None';
        insert sobj;
        System.assert(true);
        System.enqueueJob(new inc_EnqueueDataPartInsert(sobj.Id, repdata.Id, '', '', 'GET', ''));
        Test.stopTest();
        
    }
    }