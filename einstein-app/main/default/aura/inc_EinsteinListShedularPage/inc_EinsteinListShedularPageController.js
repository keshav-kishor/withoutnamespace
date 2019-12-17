({
    fetch: function (cmp, event, helper) {
        var action = [
            { label: 'SCHEDULE', name: 'SCHEDULE' },
            { label: 'RUN NOW', name: 'RUN_NOW' },
            { label: 'UNSCHEDULE', name: 'UNSCHEDULE' },
            { label: 'DELETE', name: 'DELETE' }
        ];
       cmp.set('v.columns', [
           {label: 'CATEGORY', fieldName: 'Category__c', type: 'text' },
           {label: 'APP', fieldName: 'App_Name__c', type: 'text'},
           {label: 'LAST RUN', fieldName: 'Last_Run_Date__c', type: 'text'},
           {label: 'NEXT SCHEDULED RUN', fieldName: '', type: 'text '},
           {type: 'action', typeAttributes: { rowActions: action, variant: 'bare' } }
            ]);
        helper.fetchHelper(cmp);   
   },

    handleRowAction: function (cmp, event, h) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        //var evt = $A.get("e.force:navigateToComponent");
        console.log('row ' , row.Id, row.App_Name__c);
        switch (action.name) {
            case 'SCHEDULE':
                cmp.set("v.isOpen", true);
                cmp.set("v.selAppName", row.App_Name__c);
                break;
                case 'RUN_NOW':
                cmp.set("v.isRunNow", true);
                h.onDataSyncClick(cmp, event, h, row.Id);
                break;
            case 'DELETE':
                helper.remove(cmp, row);
                break;
        }
    }, 
    
    freqChange:function( component, event,  h ){
        var changeValue = event.getParam("value");
        //component.set("v.isSho")
    },
    onScheduleClick:function( component, event,  h ){
        //var appId = event.getSource().get("v.name");
        //component.set("v.selAppId", appId);
        //component.set("v.showSchDiv", true);
        //var reportInfo = component.get("v.reportInfo");
        //console.log('reportInfo.... ',reportInfo);
        component.set("v.isOpen", true);
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
    closeRunNowModel: function(component, event, helper) {
      // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
      component.set("v.isRunNow", false);
   },
     handleSelect: function (cmp, event, helper) {
        var selectedMenuItemValue = event.getParam("value");
   },
 
    handleChange: function (cmp, event) {
        // This will contain the string of the "value" attribute of the selected option
        var selectedOptionValue = event.getParam("value");
       // alert("Option selected with value: '" + selectedOptionValue + "'");
    },
    handleTimeChange: function (cmp, event) {
        // This will contain the string of the "value" attribute of the selected option
        var selectedOptionValue = event.getParam("value");
        
    }

});