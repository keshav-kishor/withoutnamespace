global with sharing class inc_Sch_inContactsDatasetCreation implements Schedulable{
    
    
    global void execute(SchedulableContext sc) {
        inc_ReportScheduler__c repList = [SELECT Id, Underlying_Reports__c, UpdateScheduledJob__c, App_Name__c FROM inc_ReportScheduler__c limit 1];
        
        String appName = repList.App_Name__c.replaceAll(' ', '_');
        List<String> repidList = repList.Underlying_Reports__c.split(',');
        List<Integer> repIdIntList = new List<Integer>();
        for(String repId : repidList){
            repIdIntList.add(Integer.valueOf(repId));
        }
        for(InContact_Reports__mdt repdata : [SELECT Id FROM InContact_Reports__mdt WHERE ReportId__c IN:repIdIntList ]){
            if(!Test.isRunningTest()) {
            	String responseStr = inc_CreateDataset.createDataset(repdata.Id, 'Scheduling Error' , appName);
            }
        }
        
    }
}