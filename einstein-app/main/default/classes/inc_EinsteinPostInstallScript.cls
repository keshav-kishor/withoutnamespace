public class inc_EinsteinPostInstallScript  {

    public void insertReportMetaData(){
        
        Map<String, Object> maptest = new Map<String, Object>();
        maptest.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest.put('Dataset_Name__c','AgentList1');
        maptest.put('Method__c','GET');
        maptest.put('ReportId__c','1');
        maptest.put('Report_URL__c','services/v16.0/agents');
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.AgentList1','AgentList1',maptest);
        
        Map<String, Object> maptest1 = new Map<String, Object>();
        maptest1.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest1.put('Dataset_Name__c','Completed_Contact_Details');
        maptest1.put('Method__c','GET');
        maptest1.put('ReportId__c','13');
        maptest1.put('Report_URL__c','/services/v8.0/contacts/completed');
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.Completed_Contact_Details','Completed_Contact_Details',maptest1);
        
        Map<String, Object> maptest2 = new Map<String, Object>();
        maptest2.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest2.put('Dataset_Name__c','MediaTypes1');
        maptest2.put('Method__c','GET');
        maptest2.put('ReportId__c','3');
        maptest2.put('Report_URL__c','/services/v1.0/media-types');
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.MediaTypes1','MediaTypes1',maptest2);
        
        Map<String, Object> maptest3 = new Map<String, Object>();
        maptest3.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest3.put('Dataset_Name__c','SkillsSummary1');
        maptest3.put('Method__c','GET');
        maptest3.put('ReportId__c','4');
        maptest3.put('Report_URL__c','/services/v3.0/skills/summary');
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.SkillsSummary1','SkillsSummary1',maptest3);
        
        Map<String, Object> maptest4 = new Map<String, Object>();
        maptest4.put('Base_Url__c','https://api-b2.incontact.com/inContactAPI/');
        maptest4.put('Dataset_Name__c','Teams1');
        maptest4.put('Method__c','GET');
        maptest4.put('ReportId__c','2');
        maptest4.put('Report_URL__c','/services/v15.0/teams');
        inc_CreateUpdateMetadataUtils.createUpdateMetadata('InContact_Reports.Teams1','Teams1',maptest4);
		        
    }
    
    public void insertScheduler(){
        List<inc_ReportScheduler__c> repSchedulerList = new List<inc_ReportScheduler__c>();
        if(Schema.sObjectType.inc_ReportScheduler__c.fields.Category__c.isCreateable() && 
           Schema.sObjectType.inc_ReportScheduler__c.fields.Category__c.isUpdateable()  &&  
           Schema.sObjectType.inc_ReportScheduler__c.fields.App_Name__c.isCreateable()  && 
           Schema.sObjectType.inc_ReportScheduler__c.fields.App_Name__c.isUpdateable()){
               inc_ReportScheduler__c repSchFCR_CA = new inc_ReportScheduler__c();
               repSchFCR_CA.Category__c = 'First Call Resolution';
               repSchFCR_CA.App_Name__c = 'Case Analysis';
               repSchedulerList.add(repSchFCR_CA);
               
               inc_ReportScheduler__c repSchFCR_VA = new inc_ReportScheduler__c();
               repSchFCR_VA.Category__c = 'First Call Resolution';
               repSchFCR_VA.App_Name__c = 'Voice Quality Analysis';
               repSchedulerList.add(repSchFCR_VA);
               
               inc_ReportScheduler__c repSchFCR_CSAT = new inc_ReportScheduler__c();
               repSchFCR_CSAT.Category__c = 'First Call Resolution';
               repSchFCR_CSAT.App_Name__c = 'Customer Satisfaction (CSAT)';
               repSchedulerList.add(repSchFCR_CSAT);
               
               inc_ReportScheduler__c repSchSP_LA = new inc_ReportScheduler__c();
               repSchSP_LA.Category__c = 'Sales Productivity';
               repSchSP_LA.App_Name__c = 'Lead Conversion Analysis';
               repSchedulerList.add(repSchSP_LA);
               
               inc_ReportScheduler__c repSchSP_OA = new inc_ReportScheduler__c();
               repSchSP_OA.Category__c = 'Sales Productivity';
               repSchSP_OA.App_Name__c = 'Opportunity Conversion Analysis';
               repSchedulerList.add(repSchSP_OA);
               
               insert repSchedulerList;
      }
    }
    
    
    
}