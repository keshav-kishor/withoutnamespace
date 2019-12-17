@namespaceAccessible
public with sharing class CustomLogger {
    private String logLines = '';
    private logLevel levelSet = logLevel.ERROR; //Set default log level ERROR
    private Id folderId = UserInfo.getUserId();
    private String className;
    private String docName;
    private String docType;

@namespaceAccessible
    public static CustomLogger getSettingsLogger(String callingClassName) {
        CustomLogger logger = new CustomLogger(callingClassName, 'inContactEinsteinApp_log', 'txt');
        logger.levelSet = logLevel.ALL; //Log everything for settings page
        return logger;
    }

@namespaceAccessible
    public CustomLogger( String name ) {
        this.className = name;
        this.docName = 'eisnteinApp_Sf';
        this.docType = 'rtf';
        this.levelSet = logLevel.ALL;
    }

    private CustomLogger(String callingClassName, String fileName, String fileType) {
        this.docType = fileType;
        this.className = callingClassName;
        this.docName = fileName;
    }
    @namespaceAccessible
    public void addLog(logLevel level, String methodName, String value) {
        System.debug(LoggingLevel.DEBUG, value);
        if (this.levelSet.ordinal() <= level.ordinal()) {
            String logMsg = level.name() + ' [' + className + '.' + methodName + '] ' + value + '\r\n';
            logLines = logLines + Datetime.now().format('yyyy-MM-dd HH:mm:ss.SSS') + ' ' + logMsg;
        }
    }
    @namespaceAccessible
    public String getSfLogDocumentId() {
        List<Document> existing = [SELECT Id FROM Document WHERE Name = :docName AND Folderid = :folderId LIMIT 1];
        if (existing != null && existing.size() > 0) {
            return existing.get(0).Id;
        }
        return '';
    }
    @namespaceAccessible
    public Void saveLog(){
        if (logLines.length() == 0) {
            System.debug(LoggingLevel.INFO, 'incCustomerLogger.saveLog(), nothing to write in document');
            return;
        }
        String docId = '';
        String logs2Write = '';
        try {
            Integer maxByte = 1500000;
            Integer currentByte = 0;
            Integer endIndex = 0;
            if (Test.isRunningTest()) {
                maxByte = 200;
            }
            List<Document> existing = [SELECT Id, Body, BodyLength FROM Document WHERE Name = :docName AND Folderid = :folderId LIMIT 1];
            if (existing != null && existing.size() > 0) {
                docId = existing.get(0).Id;
                logs2Write = existing.get(0).Body.toString() + logLines;
            }
            else {
                logs2Write = logLines;
            }
            currentByte = logs2Write.length();
            //Truncate the previous logStatements if the size is exceeded      
            if (currentByte > maxByte) {
                endIndex = currentByte - maxByte;
                if (endIndex >= 2000) {
                    logs2Write = logs2Write.substring(endIndex);
                    endIndex = logs2Write.indexOf('\r\n');
                    logs2Write = logs2Write.substring(endIndex + 1);
                }
            }
        }
        catch (Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Exception in incCustomerLogger.saveLog(),  Message: ' + ex.getMessage() + ', StackTrace:' + ex.getStackTraceString());
            logs2Write = logLines;
        }
        finally {
            CreateOrUpdateDocument(docId, logs2Write);
            logLines = '';
        }
    }

    private void CreateOrUpdateDocument(String Id, String body) {
        if (String.isEmpty(body)) {
            return;
        }
        
        try {
            Document sfDoc = new Document();
            String docId = String.isEmpty(Id)? getSfLogDocumentId() : Id;
           // Schema.DescribeSObjectResult s = Document.sObjectType.getDescribe();
           // Boolean isCreateable = s.isCreateable();
            if(Schema.sObjectType.Document.fields.Type.isCreateable() && 
               Schema.sObjectType.Document.fields.Type.isUpdateable()  &&  
               Schema.sObjectType.Document.fields.Name.isCreateable()  && 
               Schema.sObjectType.Document.fields.Name.isUpdateable() && 
               Schema.sObjectType.Document.fields.Body.isCreateable()  && 
               Schema.sObjectType.Document.fields.Body.isUpdateable() && 
               Schema.sObjectType.Document.fields.FolderId.isCreateable()  && 
               Schema.sObjectType.Document.fields.FolderId.isUpdateable()){
                   if (String.isNotEmpty(docId)) {
                       sfDoc.Id = docId;
                   }
                   sfDoc.Type = docType;
                   sfDoc.Name = docName;
                   sfDoc.FolderId = folderId;
                   Blob blogData = Blob.valueOf(body);
                   sfDoc.Body = blogData;
                   upsert sfDoc;
               }    
        }
        catch(Exception ex) {
            System.debug(LoggingLevel.ERROR, 'Exception in incCustomerLogger.CreateOrUpdateDocument() Message: ' + ex.getMessage() + ', StackTrace:' + ex.getStackTraceString());
        }
    }

@namespaceAccessible
    public enum logLevel { 
        ALL, 
        TRACE, 
        DEBUG, 
        INFO, 
        WARN, 
        ERROR, 
        FATAL
    }
}