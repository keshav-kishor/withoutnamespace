@isTest
public class inc_Sch_inContactsDatasetCreation_Test {
    
    	@testSetup 
        static void setup() {
            List<inc_ReportScheduler__c> repSchedulerList = new List<inc_ReportScheduler__c>();
            inc_ReportScheduler__c repSchFCR_VA = new inc_ReportScheduler__c();
            repSchFCR_VA.Category__c = 'First Call Resolution';
            repSchFCR_VA.App_Name__c = 'Voice Quality Analysis';
            repSchFCR_VA.Underlying_Reports__c = '13';
            repSchedulerList.add(repSchFCR_VA);
            insert repSchedulerList;
    
        }
    
        static testmethod void execute(){
            inc_Sch_inContactsDatasetCreation sec = new inc_Sch_inContactsDatasetCreation();
            test.startTest();
            String sch ='0 48 * * * ?'; 
            System.schedule('Schedule to test dataset sechdular', sch, sec);
            test.stopTest();
                
            system.assert(true);
    	}

}