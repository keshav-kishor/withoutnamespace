@namespaceAccessible
public with sharing class HttpUtil {
    
    // Utility class for all Http Callouts from Salesforce Apex 
    
    private Integer timeout = 15000;
    private HttpRequest request;
    private CustomLogger logger;
    @namespaceAccessible
    public HttpUtil(String url, String authValue, CustomLogger incLogger) {
        logger = incLogger;
        logger.addLog(CustomLogger.logLevel.TRACE, 'HttpEngine', 'METHOD ENTRY');
     
        request = new HttpRequest();
        setRequestHeader('Content-Type', 'application/json; charset=UTF-8');  
        setRequestHeader('Accept', 'application/json');
        setRequestHeader('Authorization', authValue);
        request.setEndPoint(url);
        request.setTimeOut(timeout);
        logger.addLog(CustomLogger.logLevel.TRACE, 'HttpEngine', 'METHOD EXIT');
    }
    @namespaceAccessible
     public HttpUtil(String url, CustomLogger incLogger) {
        logger = incLogger;
        logger.addLog(CustomLogger.logLevel.TRACE, 'HttpEngine', 'METHOD ENTRY');
     
        request = new HttpRequest();
        setRequestHeader('Content-Type', 'application/json; charset=UTF-8');  
        setRequestHeader('Accept', 'application/json');
        request.setEndPoint(url);
        request.setTimeOut(timeout);
        logger.addLog(CustomLogger.logLevel.TRACE, 'HttpEngine', 'METHOD EXIT');
    }
    @namespaceAccessible
    public void setRequestHeader(String key,String value){
        request.setHeader(key, value);              
    }
    @namespaceAccessible
    public DataModels.ApiResponse doGet(){
        return execute('GET');
    }
    @namespaceAccessible
    public DataModels.ApiResponse doPost(String content){
        request.setBody(content);
        return execute('POST');
    }
    @namespaceAccessible
    public DataModels.ApiResponse doPut(String content){
        request.setBody(content);
        return execute('PUT');
    }
    
    private DataModels.ApiResponse execute(String method) {
        logger.addLog(CustomLogger.logLevel.TRACE, 'execute', 'METHOD ENTRY');
        DataModels.ApiResponse apiResp = new DataModels.ApiResponse();
        try {
            request.setMethod(method);
            Http httpProtocol  = new Http();
            logger.addLog(CustomLogger.logLevel.DEBUG, 'execute', method + ' >> '+ request.getEndpoint());            
            HttpResponse response = httpProtocol.send(request);
            logger.addLog(CustomLogger.logLevel.DEBUG, 'execute', '<< statusCode: ' + response.getStatusCode()+ ', statusText: ' + response.getStatus() + ', data: ' + response.getBody());
            apiResp.statusCode = response.getStatusCode();
            apiResp.statusText = response.getStatus();
            apiResp.data = response.getBody();
            apiResp.error = '';
        }
        catch(Exception ex) {
            apiResp.error = 'message: ' + ex.getMessage();
            logger.addLog(CustomLogger.logLevel.ERROR, 'execute', 'EXCEPTION with message: ' + ex.getMessage() + ', \n stackTrace :' + ex.getStackTraceString());
        } finally {
            logger.addLog(CustomLogger.logLevel.TRACE, 'execute', 'METHOD EXIT');
        }
        return apiResp;
    }
}