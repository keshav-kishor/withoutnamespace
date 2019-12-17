({
    doInit : function(component, event, helper) {
        console.log('resultMap... ');
        var action = component.get("c.fetchAppSchInfo");
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('resultMap... ',res);
            var reportInfo = res.ReportInfo; 
            component.set("v.reportInfo",reportInfo);
        });
        
        $A.enqueueAction(action);    
    },
    freqChange:function( component, event,  h ){
        var changeValue = event.getParam("value");
        //component.set("v.isSho")
    },
    onScheduleClick:function( component, event,  h ){
        var appId = event.getSource().get("v.name");
        component.set("v.selAppId", appId);
        component.set("v.showSchDiv", true);
        var reportInfo = component.get("v.reportInfo");
        console.log('reportInfo.... ',reportInfo);
    },
    onDataSyncClick:function( component, event,  helper ){
        var appId = event.getSource().get("v.name");
        console.log('appId .... ',appId);
        component.set("v.appId", appId);
        var action = component.get("c.runDataSync");
        action.setParams({
            "appId":appId
        });
        console.log('resultMap..1. ');
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('resultMap... ',res.JobEnqueued);
            if(res.JobEnqueued == 'Job Enqueued');
            helper.getError(component, event, helper);
            
            component.set("v.isOpen", true);
            //alert('Creating datasets. Please check status on below url  https://keshav-kishor-en-dev-ed.my.salesforce.com/analytics/wave/wave.apexp?tsid=02u3i000001BfIb#dataManager');
        });
        
        $A.enqueueAction(action); 
    },
    saveRepSchInfo:function( component, event,  h ){
        var appId = component.get("v.selAppId");
        console.log('appId .... ',appId);
        
        var schDay = component.get("v.schSelOption") == 'Monthly'?component.get("v.selDay"):component.get("v.SelWkDay");
        var action = component.get("c.saveSchInfo");
        var sDate = component.get("v.sDate");
        sDate = $A.localizationService.formatDate(sDate, "MM/dd/yyyy hh:mm a");
        console.log('sDate format==== '+ sDate);
        action.setParams({
            "repSchMap":{
                "Id":appId,
                "Frequency":component.get("v.schSelOption"),
                "Scheduled_Day": schDay,
                "StartDate" : sDate
            }
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('resultMap... ',res);
        });
        
        $A.enqueueAction(action); 
    },
    onRSBackClick: function(cmp, event, helper) {
         var cmpEvent = $A.get("e.c:inc_CategoryDetailBack");
            //cmpEvent.setParams({'selCategory':selReportId});
            cmpEvent.fire();
    },
    closeModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.isOpen", false);
   },
 
})