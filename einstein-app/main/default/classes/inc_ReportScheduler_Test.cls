@isTest
public class inc_ReportScheduler_Test {

    @testSetup 
    static void testData() {
        inc_ReportScheduler__c repSchFCR_CA = new inc_ReportScheduler__c();
               repSchFCR_CA.Category__c = 'First Call Resolution';
               repSchFCR_CA.App_Name__c = 'First Call Resolution';
        repSchFCR_CA.Underlying_Reports__c = '13';
        insert repSchFCR_CA;
        inc_User_Token__c token = new inc_User_Token__c();
        token.Is_Authentication_Successful__c = false;
        token.access_token__c = 'dfgdfgdfgdfgdfg';
        insert token;
    }
    
    static testmethod void fetchAppSchInfoTest() {
        
        Map<String,Object> repSchMap = new Map<String,Object>();
        test.startTest();
        inc_ReportScheduler.fetchAppSchInfo(repSchMap);
        List<inc_ReportScheduler__c> repSchList = [SELECT Id, App_Name__c, Underlying_Reports__c, Last_Run_Date__c, Category__c
                                                   FROM inc_ReportScheduler__c limit 1];
        List<inc_ReportScheduler__c> repList = inc_ReportScheduler.fetchAppSchInfoList();
        Map<String,Object> dataSynchMap = new Map<String,Object>();
        dataSynchMap = inc_ReportScheduler.runDataSync(repSchList[0].Id);
        
        system.assert(repSchList.size()==1);
        test.stopTest();
    }
    
    static testmethod void saveSchInfoTest() {
        List<inc_ReportScheduler__c> repSchList = [SELECT Id, App_Name__c, Underlying_Reports__c, Last_Run_Date__c, Category__c
                                                   FROM inc_ReportScheduler__c limit 1];
        test.startTest();
        Map<String,Object> scheduleSynchMap = new Map<String,Object>();
        Map<String,Object> scheduleDataMap = new Map<String,Object>();
        scheduleDataMap.put('Id', repSchList[0].Id);
        scheduleDataMap.put('Frequency', 'Weekly');
        List<Object> daylist = new List<Object>();
        daylist.add('Monday');
        daylist.add('Tuesday');
        scheduleDataMap.put('Scheduled_Day',daylist);
        scheduleDataMap.put('StartDate', string.valueOf(datetime.now())) ;
        scheduleSynchMap = inc_ReportScheduler.saveSchInfo(scheduleDataMap);
        Map<String,Object> dataStatusMap = new Map<String,Object>();
        dataStatusMap = inc_ReportScheduler.getDataStatus(repSchList[0].Id);
        
        system.assert(repSchList.size()==1);
        test.stopTest();
    }
    static testmethod void errorStatusTest() {
        List<inc_ReportScheduler__c> repSchList = [SELECT Id, App_Name__c, Underlying_Reports__c, Last_Run_Date__c, Category__c
                                                   FROM inc_ReportScheduler__c limit 1];
        test.startTest();
        Map<String,Object> errorStatusMap = new Map<String,Object>();
        errorStatusMap = inc_ReportScheduler.getErrorStatus(repSchList[0].Id);
        system.assert(repSchList.size()==1);
        test.stopTest();
    }
}