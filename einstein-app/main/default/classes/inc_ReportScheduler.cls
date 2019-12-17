public  with sharing class inc_ReportScheduler {
    
    @AuraEnabled
    public static Map<String,Object> fetchAppSchInfo(Map<String,Object> catMap){
    
        Map<String,Object> repSchMap = new Map<String,Object>();
        List<inc_ReportScheduler__c> repSchList = [SELECT Id, App_Name__c, Last_Run_Date__c, Category__c
                                                   FROM inc_ReportScheduler__c limit 1];
        repSchMap.put('ReportInfo',repSchList);
        return repSchMap;
        
    }
     @AuraEnabled
     public static List<inc_ReportScheduler__c> fetchAppSchInfoList(){
        List<inc_ReportScheduler__c> repSchList = [SELECT Id, App_Name__c, Last_Run_Date__c, Category__c
                                                   FROM inc_ReportScheduler__c limit 1];       
        return repSchList;
        
    }
    @AuraEnabled
    public static Map<String,Object> runDataSync(String appId){
        system.debug('runDataSync === ');
    	Map<String,Object> resMap = new Map<String,Object>();
        
        inc_ReportScheduler__c repList = [SELECT Id, Underlying_Reports__c, App_Name__c, Category__c FROM inc_ReportScheduler__c 
                                         WHERE Id=:appId];
        String appName = repList.Category__c.replaceAll(' ', '_');
        List<String> repidList = repList.Underlying_Reports__c.split(',');
        List<Integer> repIdIntList = new List<Integer>();
        for(String repId : repidList){
            repIdIntList.add(Integer.valueOf(repId));
        }
        for(InContact_Reports__mdt repdata : [SELECT Id FROM InContact_Reports__mdt WHERE ReportId__c IN:repIdIntList ]){
            String responseStr = inc_CreateDataset.createDataset(repdata.Id, appId , appName);
        }
        resMap.put('JobEnqueued','Job Enqueued');
        return resMap;
    }
    @AuraEnabled
    public static Map<String,Object> saveSchInfo(Map<String,Object> repSchMap){
        Map<String,Object> resMap = new Map<String,Object>();
        system.debug('repSchMap ==== '+ repSchMap);
        try{
        inc_ReportScheduler__c repSch = new inc_ReportScheduler__c(Id=(Id)repSchMap.get('Id'));
            if(Schema.sObjectType.inc_ReportScheduler__c.fields.Frequency__c.isCreateable() && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.Frequency__c.isUpdateable()  &&  
               Schema.sObjectType.inc_ReportScheduler__c.fields.Start_DateTime__c.isCreateable()  && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.Start_DateTime__c.isUpdateable() && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.Scheduled_Day__c.isCreateable()  && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.Scheduled_Day__c.isUpdateable() &&
               Schema.sObjectType.inc_ReportScheduler__c.fields.UpdateScheduledJob__c.isCreateable()  && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.UpdateScheduledJob__c.isUpdateable() &&
               Schema.sObjectType.inc_ReportScheduler__c.fields.CRON_Expression__c.isCreateable()  && 
               Schema.sObjectType.inc_ReportScheduler__c.fields.CRON_Expression__c.isUpdateable()){
                   repSch.Frequency__c = (String)repSchMap.get('Frequency');
                   String daysStr = '';
                   system.debug('days.....'+ repSchMap.get('Scheduled_Day'));
                   String strSDate = (String)repSchMap.get('StartDate');
                   system.debug('strSDate ==== '+ strSDate);
                   DateTime sDate = DateTime.valueOf(strSDate);
                   system.debug('sDate ==== '+ sDate);
                   repSch.Start_DateTime__c = sDate;
                   String crnExp = sDate.second()+' '+sDate.minute()+ ' '+ sDate.hour();
                   //Seconds Minutes Hours Day_of_month Month Day_of_week Optional_year
                   
                   if((String)repSchMap.get('Frequency') == 'Weekly'){
                       
                       List<Object> dayList = (List<Object>)repSchMap.get('Scheduled_Day');
                       crnExp = crnExp+ ' ? *'+' ';
                       for(Object obj : dayList){
                           daysStr = daysStr + String.valueOf(obj) + ';';
                           crnExp = crnExp+ String.valueOf(obj) + ',';
                       }
                       crnExp = crnExp.removeEnd(',');
                       system.debug('crnExp === '+ crnExp);
                   }else{
                       daysStr = (String)repSchMap.get('Scheduled_Day');
                       crnExp = crnExp+ ' ' + daysStr +' * ?' ;
                   }
                   repSch.Scheduled_Day__c = daysStr;
                   repSch.UpdateScheduledJob__c = true;
                   repSch.CRON_Expression__c = crnExp;
                   update repSch;
                   String jobName = (Id)repSchMap.get('Id') + '_' + 'Analytics Data Synch';
                   List<CronTrigger> job = [SELECT Id, CronJobDetail.Id, CronJobDetail.Name, CronJobDetail.JobType 
                                            FROM CronTrigger WHERE CronJobDetail.Name like '%Analytics Data Synch'];
                   if(job.size()>0){
                       System.abortJob(job[0].id);
                   }
                   String Id = scheduleJob((Id)repSchMap.get('Id'), crnExp, jobName);
                   resMap.put('Success',true);
               }           
        }catch(Exception ex){
            resMap.put('Success', false);
            resMap.put('Error',ex.getMessage());
        }
        return resMap;
    }
    public static String scheduleJob(Id appId, String crnExp, String jobName){
        system.debug('appId === '+ appId);
        inc_Sch_inContactsDatasetCreation schJob = new inc_Sch_inContactsDatasetCreation();
        String jobID = system.schedule(jobName, crnExp, new inc_Sch_inContactsDatasetCreation());
        
        return jobID;
    }
   
    @AuraEnabled
    public static Map<String,Object> getDataStatus(String appId){
        inc_ReportScheduler__c repList = [SELECT Id, Underlying_Reports__c, App_Name__c, Category__c FROM inc_ReportScheduler__c 
                                         WHERE Id=:appId];
        String appName = repList.Category__c.replaceAll(' ', '_');
        List<String> repidList = repList.Underlying_Reports__c.split(',');
        List<Integer> repIdIntList = new List<Integer>();
        for(String repId : repidList){
            repIdIntList.add(Integer.valueOf(repId));
        }
        List<String> datasetsLst = new List<String>();
        for(InContact_Reports__mdt repdata : [SELECT Id, Dataset_Name__c FROM InContact_Reports__mdt WHERE ReportId__c IN:repIdIntList ]){
            datasetsLst.add(repdata.Dataset_Name__c);
        }
        system.debug('datasetsLst === '+ datasetsLst);
        //Type idArrType = Type.forName('List<string>'); 
        
        //List<String> datasets =  (List<String>)JSON.deserialize(datasetList, idArrType);
        
        Integer datasetLength = datasetsLst.size();
        /*for(String dtStr :datasets ){
            dtStr = appName+'_'+dtStr;
            datasetsLst.add(dtStr);
        }*/
        map<String,Object> statusMap = new map<String,Object>();
        
        List<InsightsExternalData> dataSt = [SELECT status, EdgemartAlias,Action, LastModifiedDate  FROM  InsightsExternalData 
                                             WHERE EdgemartContainer = :appName AND EdgemartAlias IN: datasetsLst
                                             ORDER BY LastModifiedDate   DESC LIMIT :datasetLength];
        for(InsightsExternalData dt:dataSt){
            statusMap.put(dt.EdgemartAlias, dt);
            
        }
        return statusMap;
    }
	@AuraEnabled 
    public static Map<String,Object> getErrorStatus(String appId){
        map<String,Object> statusMap = new map<String,Object>();
        system.debug('error ==== '+ appId);
        inc_User_Token__c authToken = [select access_token__c,expires_in__c, Is_Authentication_Successful__c from inc_User_Token__c LIMIT 1];
       //inContactException__c incError = [SELECT Id, Message__c FROM inContactException__c WHERE ReportId__c = :appId Order By CreatedDate Desc LIMIT 1 ];
        if(!authToken.Is_Authentication_Successful__c){
            statusMap.put('hasError',true);
            statusMap.put('message','Error in connecting with inContact Report API');
        }else{
            statusMap.put('hasError',false);
        }
        return statusMap;
    }

    /* 
    
    //public Static String url = '/services/data/v45.0/wave/templates';
    @AuraEnabled
    public static Map<String,Object> insertCategoryRec(Map<String,Object> catMap){
        Map<String,Object> resultMap = new Map<String,Object>();
        system.debug('catMap === '+ catMap);
        List<Category__c> catRecList = new List<Category__c>();
        String name = (String)catMap.get('selReport');
        String appName = (String)catMap.get('appName');
        /*Category__c catRec = [SELECT Id FROM Category__c WHERE Name=:name];
        catRec.Name = name;
        String sDate = (String)catMap.get('sDate');
        catRec.Start_Date__c = Date.valueOf(sDate);
        String eDate = (String)catMap.get('eDate');
        catRec.End_Date__c = Date.valueOf(eDate);
        system.debug('scheduled'+ catMap.get('showSchDiv'));
        catRec.Scheduled__c = (Boolean)catMap.get('showSchDiv');
        
        
        
            //update catRec;
            
            system.debug('catidlist === '+ catRec);
            List<String> lstRepId = new List<String>();
            Set<Integer> repIdSet = new Set<Integer>();
            List<Integer> repIdList = new List<Integer>();
            for(Category__c catRes : [SELECt Id, Underlying_Reports__c FROM Category__c WHERE name =:name]){
                system.debug('catRes.Underlying_Reports__c === '+ catRes.Underlying_Reports__c);
                String repList = catRes.Underlying_Reports__c;
                lstRepId = repList.split(';');
            }
            system.debug('lstRepId === '+ lstRepId);
            for(String str : lstRepId){
                repIdSet.add(Integer.valueOf(str));
            }
            repIdList.addAll(repIdSet);
            String jobId = String.valueOf(system.now());
            Map<String, Id> jobIdMap = new Map<String, Id>();
            Set<String> datasetSet = new Set<String>();
            	String responseStr = '';
                for(InContact_Report__c repdata : [SELECT Id, Dataset_Name__c FROM InContact_Report__c WHERE ReportId__c IN:repIdList ]){
                    /*jobId = System.enqueueJob(new inc_EnqueueDatasetCreation(repdata.Id));
                    jobIdMap.put(repdata.Dataset_Name__c, jobId);
                    datasetSet.add(repdata.Dataset_Name__c);
                    responseStr = inc_CreateDataset.createDataset(repdata.Id, jobId, appName);
                    AsyncApexJob jobInfo = [SELECT Status,NumberOfErrors FROM AsyncApexJob WHERE Id=:responseStr];
                    system.debug('jobInfo === '+ jobInfo);
                }
                if(responseStr != 'ERROR'){
                    resultMap.put('DatasetList',datasetSet);
                  resultMap.put('status', 'success');
                    resultMap.put('recId', jobId);
                } else {
                   resultMap.put('status', 'ERROR');
                }
            
            
            //List<InContact_Report__c> incRepList = [SELECT Id FROM InContact_Report__c WHERE Name =:cat.Report_Name__c ];
            //inc_CreateDataset.createDataset(incRepList[0].Id);
            
            //resultMap.put('status', 'success');
        return resultMap;
    }
        
    
    @AuraEnabled 
    public static Map<String,Object> getTemplateDet(String catName){
        map<String,Object> resMap = new map<String,Object>();
        Category__c catRecList = [SELECT Id, Underlying_Reports__c, Template_Id__c FROM Category__c WHERE name =:catName];
        String url = '/services/data/v45.0/wave/templates';
        String sessionId = fetchUserSessionId();
        String res = inc_internalAPICallout.get(url, sessionId);
        system.debug('temp res '+res);
        resMap.put('templateDet', res);
        resMap.put('tempIds', catRecList.Template_Id__c);
        return resMap;
    }
    public static String fetchUserSessionId(){
        String sessionId = '';
        // Refer to the Page 
        PageReference reportPage = Page.GetSessionIdVF;
        // Get the content of the VF page
        String vfContent = reportPage.getContent().toString();
        System.debug('vfContent '+vfContent);
        // Find the position of Start_Of_Session_Id and End_Of_Session_Id 
        Integer startP = vfContent.indexOf('Start_Of_Session_Id') + 'Start_Of_Session_Id'.length(),
            endP = vfContent.indexOf('End_Of_Session_Id');
        // Get the Session Id
        sessionId = vfContent.substring(startP, endP);
        System.debug('sessionId '+sessionId);
        // Return Session Id
        return sessionId;
    }
    @AuraEnabled 
    public static Map<String,Object> createApp(String appName, String tempId){
        system.debug('appName == '+ appName + 'tempId '+tempId) ;
        map<String,Object> resMap = new map<String,Object>();
               
        JSONGenerator gen = JSON.createGenerator(true);
            gen.writeStartObject();
            //gen.writeStringField('templateSourceId', tempId);
            gen.writeStringField('label', appName);
            gen.writeStringField('name', appName.replaceAll(' ', '_'));
            gen.writeEndObject();
            
            // Get the JSON string.
            String reqString = gen.getAsString();
            system.debug('reqString===='+reqString);
        String url = '/services/data/v45.0/wave/folders';
        String sessionId = fetchUserSessionId();
        String resStr = inc_internalAPICallout.post(url, reqString, sessionId);
        resMap.put('appRes',resStr);
        return resMap;
    }
    @AuraEnabled 
    public static Map<String,Object> getAppStatus(String appId){
        map<String,Object> resMap = new map<String,Object>();
        String url = '/services/data/v45.0/wave/folders/'+ appId;
        String sessionId = fetchUserSessionId();
        String res = inc_internalAPICallout.get(url, sessionId);
        resMap.put('appRes',res);
        return resMap;
    } */
}