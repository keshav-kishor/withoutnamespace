({
    fetchHelper : function(cmp, event, helper) {     
        var action = cmp.get("c.fetchAppSchInfoList");
        action.setParams({  
        });
        action.setCallback(this, function(response){
            var state = response.getState();
            if (state === "SUCCESS") { 
               
                cmp.set("v.data", response.getReturnValue());
            }
        });
        
        $A.enqueueAction(action);       
    },
    remove: function (cmp, row) {
        var rows = cmp.get('v.data');
        var rowIndex = rows.indexOf(row);
        rows.splice(rowIndex, 1);
        cmp.set('v.data', rows);
    },
    onDataSyncClick:function( cmp, event,  helper, rowId ){
        console.log('test run', rowId);
        
        var action = cmp.get("c.runDataSync");
        action.setParams({
            "appId":rowId
        });
        console.log('resultMap..1. ');
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('resultMap... ',res);
            helper.getError(cmp, event, helper, rowId);
               /* helper.getStatus(cmp, event, helper, rowId);
                var interval = window.setInterval(
                    $A.getCallback(function() {
                        var isCompleted = cmp.get("v.isCompleted");
                        console.log('isCompleted controller=== ',isCompleted);
                        if(isCompleted) {
                            clearInterval(interval);
                            //alert('dataset created...');
                            //helper.createEApp(component, event, helper);
                        }else{
                            helper.getStatus(cmp, event, helper, rowId);
                        }
                    }), 5000
                ); 
            */
            
            //cmp.set("v.isOpen", true);
            //alert('Creating datasets. Please check status on below url  https://keshav-kishor-en-dev-ed.my.salesforce.com/analytics/wave/wave.apexp?tsid=02u3i000001BfIb#dataManager');
        });
        
        $A.enqueueAction(action); 
    },
    getStatus:function( component, event, helper, appId ){
        
        console.log('getDataStatus...1 ', appId);
        var action = component.get("c.getDataStatus");
        action.setParams({"appId":appId});
        
        console.log('getDataStatus... ');
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('res === ', res);
            var statusData =  _.map( _.where(res, {}), function(lst) {
                return { dataSetName: lst.EdgemartAlias, Status: lst.Status };
            }
                                   ); 
            
            component.set("v.datasetProgress",_.sortBy(statusData,"dataSetName"));
            console.log('resultMap status... ',res);
            var completed = true;
            _.map(_.pluck(res,"Status"), function(status){
                if(status != "Completed") {
                    completed = false;
                }
            });
            
            console.log('isCompleted === ',completed);
            component.set("v.isCompleted",completed);
            //debugger;
        });
        
        $A.enqueueAction(action);
    },
    getError:function( cmp, event, helper, rowId ){
        var action = cmp.get("c.getErrorStatus");
        action.setParams({"appId":rowId});
        console.log('getErrorStatus... ', rowId);
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('getErrorStatus... ',res);
            if(res.hasError == true){
                console.log('getErrorStatus...true  ',res);
                cmp.set("v.hasAPIError",res.hasError);
                cmp.set("v.apiErrMessage",res.message);
                cmp.set("v.isCompleted", true);
            }else{
                console.log('getErrorStatus..false. ',res);
                helper.getStatus(cmp, event, helper, rowId);
                var interval = window.setInterval(
                    $A.getCallback(function() {
                        var isCompleted = cmp.get("v.isCompleted");
                        console.log('isCompleted controller=== ',isCompleted);
                        if(isCompleted) {
                            clearInterval(interval);
                            //alert('dataset created...');
                            //helper.createEApp(component, event, helper);
                        }else{
                            helper.getStatus(cmp, event, helper, rowId);
                        }
                    }), 5000
                );  
            }
        });
        $A.enqueueAction(action);
    },
})