@isTest 
public class CustomLoggerTest{
    static testMethod void Logger_CreateSuccessful() {
         Test.startTest();
            String userId = UserInfo.getUserId();
            CustomLogger logger = new CustomLogger('TestClass');
            logger.addLog(CustomLogger.logLevel.ALL,'TestMethod','Adding Test log - all');
            logger.addLog(CustomLogger.logLevel.TRACE,'TestMethod','Adding Test log - trace');
            logger.addLog(CustomLogger.logLevel.DEBUG,'TestMethod','Adding Test log - debug');
            logger.addLog(CustomLogger.logLevel.INFO,'TestMethod','Adding Test log - info');
            logger.addLog(CustomLogger.logLevel.WARN,'TestMethod','Adding Test log - warn');
            logger.addLog(CustomLogger.logLevel.ERROR,'TestMethod','Adding Test log - error');
            logger.addLog(CustomLogger.logLevel.FATAL,'TestMethod','Adding Test log - fatal');
            logger.saveLog();
            String logID = logger.getSfLogDocumentId();
            List<Document> existing = [Select id, Name, Body,folderid From Document where Id = :logID];
            if(existing != null && existing.size() > 0){                
                System.assertEquals(userId, existing.get(0).FolderId); 
                System.assertEquals('eisnteinApp_Sf', existing.get(0).Name); 
            }
        Test.stopTest();        
    }
    
    static testMethod void Logger_DoesNotExist() {
         Test.startTest();
            String userId = UserInfo.getUserId();
            CustomLogger logger = new CustomLogger('TestClass');          
            String logID = logger.getSfLogDocumentId();         
            System.assertEquals(true, String.isBlank(logID));               
        Test.stopTest();        
    }

    static testMethod void testSaveLogToExistingDocument() {
        CustomLogger logger = CustomLogger.getSettingsLogger('TestClass');
        logger.addLog(CustomLogger.logLevel.ALL, 'TestMethod', 'Create Document');
        logger.saveLog();
        Test.startTest();
            logger.addLog(CustomLogger.logLevel.ALL, 'TestMethod', 'Update Document');
            logger.saveLog();
            List<Document> docList = [SELECT Id FROM Document];
            System.assertEquals(true, docList.size() > 0);
        Test.stopTest();
        
    }
}