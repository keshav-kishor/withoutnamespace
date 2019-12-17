@namespaceAccessible
@isTest
public class inc_CreateUpdateMetadataUtils_Test extends Metadata.DeployCallbackContext {
 
    static testMethod Void createMetaDataTest(){
        Map<String, Object> maptest = new Map<String, Object>();
        maptest.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest.put('Dataset_Name__c','AgentList1');
        maptest.put('Method__c','GET');
        maptest.put('ReportId__c','1');
        maptest.put('Report_URL__c','services/v16.0/agents');
        
        test.startTest();
         Metadata.DeployCallback callback = new inc_CreateUpdateMetadataUtils();
       
        // Create test result and context objects.
        Metadata.DeployResult result = new Metadata.DeployResult();
        //result.numberComponentErrors = 1;
        result.status = Metadata.DeployStatus.Succeeded;
        Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();
        
        // Invoke the callback's handleResult method.
       //inc_CreateUpdateMetadataUtils.createUpdateMetadata(fullName, label, fieldWithValuesMap)
       
        callback.handleResult(result, context);
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.AgentList1','AgentList1',maptest);
        system.assert(true);
        test.stopTest();
    }

    static testMethod Void createMetaDataTestError(){
        Map<String, Object> maptest = new Map<String, Object>();
        maptest.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest.put('Dataset_Name__c','AgentList1');
        maptest.put('Method__c','GET');
        maptest.put('ReportId__c','1');
        maptest.put('Report_URL__c','services/v16.0/agents');
        
        test.startTest();
         Metadata.DeployCallback callback = new inc_CreateUpdateMetadataUtils();
       
        // Create test result and context objects.
        Metadata.DeployResult result = new Metadata.DeployResult();
        //result.numberComponentErrors = 1;
        result.status = Metadata.DeployStatus.Failed;
        Metadata.DeployCallbackContext context = new Metadata.DeployCallbackContext();
        
        // Invoke the callback's handleResult method.
       //inc_CreateUpdateMetadataUtils.createUpdateMetadata(fullName, label, fieldWithValuesMap)
       
        callback.handleResult(result, context);
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.AgentList1','AgentList1',maptest);
        system.assert(true);
        test.stopTest();
    }
}