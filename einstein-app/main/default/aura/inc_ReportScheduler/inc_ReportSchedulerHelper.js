({
	getStatus:function( component, event, helper ){
        var appId = component.get("v.appId" );
        
        console.log('getDataStatus...1 ', appId);
        var action = component.get("c.getDataStatus");
        action.setParams({"appId":appId});
        
        console.log('getDataStatus... ');
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
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
    getError:function( component, event, helper ){
        var appId = component.get("v.appId" );
        var action = component.get("c.getErrorStatus");
        action.setParams({"appId":appId});
        console.log('getErrorStatus... ', appId);
        action.setCallback(this, function(response) {
            var state = response.getState();
            var res  = response.getReturnValue();
            console.log('getErrorStatus... ',res);
            if(!$A.util.isUndefinedOrNull(res)){
                component.set("v.hasAPIError",res.hasError);
                component.set("v.apiErrMessage",res.message);
                component.set("v.isCompleted", true);
            }else{
                helper.getStatus(component, event, helper);
                var interval = window.setInterval(
                    $A.getCallback(function() {
                        var isCompleted = component.get("v.isCompleted");
                        console.log('isCompleted controller=== ',isCompleted);
                        if(isCompleted) {
                            clearInterval(interval);
                            alert('dataset created...');
                            //helper.createEApp(component, event, helper);
                        }else{
                            helper.getStatus(component, event, helper);
                        }
                    }), 5000
                ); 
            }
        });
        $A.enqueueAction(action);
    },
})