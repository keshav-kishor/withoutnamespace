public class inc_EnqueueDataPartInsert implements Queueable, Database.AllowsCallouts {
    
    public Id extDataId;
    public Id recId;
    public String baseUrl;
    public String reportUrl;
    public String method;
    public String errorId;
    
    public inc_EnqueueDataPartInsert (Id extDataId, Id recId, String baseUrl, String reportUrl, String method, String errorId) {
        this.extDataId= extDataId;
        this.recId= recId;
        this.baseUrl= baseUrl;
        this.reportUrl= reportUrl;
        this.method= method;
        this.errorId = errorId;
    }
    
    public void execute(QueueableContext context) {
        inContactException__c errRec = new inContactException__c();
        InsightsExternalDataPart dataPart = new InsightsExternalDataPart();
        
        try{
            integer top = 1000;
            integer skip = 0;
            integer pNo = 1;
            //while(top > 0){
                Map<String,Object> resMap = inc_HttpCallOut.httpCallOutJSOFunction(recId, baseUrl, reportUrl, method, top, skip);
                if((Boolean)resMap.get('SUCCESS')){
                    if(resMap.containsKey('DATAStr')){
                        String fileStr = (String)resMap.get('DATAStr');
                        dataPart.DataFile = blob.valueOf(fileStr);
                    }
                    if(resMap.containsKey('DATABlob')){
                        String fileStr = (String)resMap.get('DATABlob');
                        dataPart.DataFile = EncodingUtil.base64Decode(fileStr);
                    }
                    
                    system.debug('dataPart.DataFile===='+dataPart.DataFile);
                    dataPart.InsightsExternalDataId = extDataId;
                    dataPart.PartNumber= 1;
                    insert dataPart;
                    InsightsExternalData data = new InsightsExternalData();
                    data.Action = 'Process';
                    data.Id = extDataId;
                    system.debug('data.Id===='+data.id);
                   update data;
                     //top = 0;
                    //inc_CreateDataset.manageData(extDataId, recId);
                }else{
                    if(Schema.sObjectType.inContactException__c.fields.isError__c.isCreateable() && 
                       Schema.sObjectType.inContactException__c.fields.isError__c.isUpdateable()  &&  
                       Schema.sObjectType.inContactException__c.fields.Message__c.isCreateable()  && 
                       Schema.sObjectType.inContactException__c.fields.Message__c.isUpdateable() && 
                       Schema.sObjectType.inContactException__c.fields.ReportId__c.isCreateable()  && 
                       Schema.sObjectType.inContactException__c.fields.ReportId__c.isUpdateable()){
                           errRec.isError__c = true;
                           errRec.Message__c = 'Unable to request inContact API. Please contact your administrator';
                           errRec.ReportId__c = errorId;
                           insert errRec;
                           system.debug('errRec ==== '+ errRec.id);
                           //throw new inc_CalloutException('Unable to request inContact API. Please contact your administrator');
                       }
                }
                
           // }
        }catch(Exception ex){
            //  Schema.DescribeSObjectResult s = inContactException__c.sObjectType.getDescribe();
            //  Boolean isCreateable = s.isCreateable();
            /*if(Schema.sObjectType.inContactException__c.fields.isError__c.isCreateable() && 
               Schema.sObjectType.inContactException__c.fields.isError__c.isUpdateable()  &&  
               Schema.sObjectType.inContactException__c.fields.Message__c.isCreateable()  && 
               Schema.sObjectType.inContactException__c.fields.Message__c.isUpdateable() && 
               Schema.sObjectType.inContactException__c.fields.ReportId__c.isCreateable()  && 
               Schema.sObjectType.inContactException__c.fields.ReportId__c.isUpdateable()){
                   errRec.isError__c = true;
                   errRec.Message__c = ex.getMessage();
                   errRec.ReportId__c = errorId;
                   insert errRec;
               }*/
            
            system.debug('errRec ==== '+ ex.getMessage());
        }
    }
}