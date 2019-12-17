global  with sharing class inc_CreateDataset {
        
    @AuraEnabled
    Webservice static Id createDataset(Id recId, String errorId, String appName){
        system.debug('recId === '+ recId);
        InContact_Reports__mdt reportData = [SELECT Id, fields__c, startDate__c, endDate__c, MetaData_Json__c,  Dataset_Name__c, method__c, Report_URL__c  FROM InContact_Reports__mdt WHERE Id = :recId];
        inc_APIUser_Keys__mdt data = [SELECT resourceUrl__c  FROM inc_APIUser_Keys__mdt WHERE DeveloperName = 'inContact'];
  
        String datasetName = reportData.Dataset_Name__c;
        String baseUrl = data.resourceUrl__c;
        String reportUrl = reportData.Report_URL__c;
        String method= reportData.method__c;
        String metadataJson = '';
        if(reportData.MetaData_Json__c !=  null)
			metadataJson = reportData.MetaData_Json__c ;        
        Id jobID = inc_CreateDataset.insertMetaData(datasetName, appName, recId, baseUrl, reportUrl, method, errorId, metadataJson );
        return jobID;
    }
    
    public static String insertMetaData(String datasetName, String appName, Id recId, String baseUrl, String reportUrl, string method, String errorId, String metadataJson){
         
        InsightsExternalData sobj = new InsightsExternalData();
        sobj.Format='Csv';
        sobj.EdgemartAlias = datasetName;
        sobj.EdgemartContainer = appName;
        system.debug('metadataJson === '+ metadataJson);
        if(metadataJson!='' || metadataJson!=null)
        	sobj.MetadataJson = Blob.valueOf(metadataJson);
        sobj.Operation = 'Overwrite';
        sobj.Action = 'None';
        insert sobj;
         Id extDataId = sobj.Id;
        try{
       Id jobID = System.enqueueJob(new inc_EnqueueDataPartInsert(extDataId, recId, baseUrl, reportUrl, method, errorId));
        system.debug('jobID === '+ jobID);
       AsyncApexJob jobInfo = [SELECT Status,NumberOfErrors FROM AsyncApexJob WHERE Id=:jobID];
		system.debug('jobInfo === '+ jobInfo);
        return String.valueOf(jobID);
        }catch(Exception ex){
            return 'ERROR';
        }
        
    }
    
}