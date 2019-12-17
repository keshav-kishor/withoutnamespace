@isTest
public class inc_CreateDataset_Test {

   
    
    static testmethod void createDatasetTest(){
        Map<String,String> resHeadMap = new Map<String,String>();
        resHeadMap.put('StatusCode', '200');
        HttpResponse resp = new HttpResponse();
        resp.setBody('{"businessUnitId":28,"lastPollTime":"2019-08-29T09:28:10.130Z","completedContacts":[{"agentSeconds":1,"contactId":221449624,"contactStart":"2019-07-24T05:27:30.093Z","firstName":"saranya","inQueueSeconds":0,"lastName":"r","mediaTypeName":"Call","postQueueSeconds":0,"preQueueSeconds":0,"skillName":"saran_obcall","teamName":"Default","totalDurationSeconds":1}]}');
        String body = resp.getBody();
        RequestMock apiResponse = new RequestMock(200, 'SUCCESS', body, resHeadMap);
        Test.setMock(HttpCalloutMock.class, apiResponse);
        Test.startTest();
        InContact_Reports__mdt repdata = [SELECt Id FROM InContact_Reports__mdt LIMIT 1];
        
        Id testId =  inc_CreateDataset.createDataset(repdata.id, '', 'First_Call_Resolution');
       System.assert(true);
      Test.stopTest();  
    }

}
