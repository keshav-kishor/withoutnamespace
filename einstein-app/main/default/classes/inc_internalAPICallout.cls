public class inc_internalAPICallout {
    
/*   
    public String patch(String urlStr, String body, String sessionId){
        //Make sure your Salesforce instance URL is added in remote site settings
        String sfdcURL = URL.getSalesforceBaseUrl().toExternalForm(); 
        system.debug('sfdcURL === '+ sfdcURL);
        String restAPIURL = sfdcURL + urlStr + '?_HttpMethod=PATCH';  
        
        HttpRequest httpRequest = new HttpRequest();  
        httpRequest.setMethod('POST');   
        httpRequest.setHeader('Authorization', 'OAuth ' + sessionId);        
        httpRequest.setHeader('Authorization', 'Bearer ' + sessionId); 
        httpRequest.setHeader('X-HTTP-Method-Override','PATCH');
        httpRequest.setEndpoint(restAPIURL); 
         httpRequest.setHeader('content-Type', 'application/json; charset=UTF-8');
        httpRequest.setHeader('Accept', 'application/json, text/javascript, ; q=0.01');
        httpRequest.setBody(body);
        String response = '';
        try {  
            Http http = new Http();  
            system.debug('httpRequest === '+ httpRequest);
            HttpResponse httpResponse = http.send(httpRequest);  
            system.debug('httpResponse.getStatusCode( == '+ httpResponse.getStatusCode());
            if (httpResponse.getStatusCode() == 201 ) {  
                response = JSON.serializePretty( JSON.deserializeUntyped(httpResponse.getBody()) );  
            } else {  
                System.debug(' httpResponse ' + httpResponse.getBody() );  
                throw new CalloutException( httpResponse.getBody() );  
            }   
        } catch( System.Exception e) {  
            System.debug('ERROR: '+ e);  
            throw e;  
        }  
        System.debug(' ** response ** : ' + response );
        return response;
    }*/
}