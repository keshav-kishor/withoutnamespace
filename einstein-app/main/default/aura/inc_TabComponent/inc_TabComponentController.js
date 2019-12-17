({
    doInit : function(component, event, helper) {
        helper.hideAllChildCmp(component, event, helper);
        helper.getCategoryJson(component, event, helper);
    },
    
    onAppClick: function(component, event, helper) {
        $A.util.addClass(component.find("custTemp"),'slds-hide');     
        $A.util.addClass(component.find("custTem"),'slds-hide');
        $A.util.removeClass(component.find("backBttnDiv"),'slds-hide');
        var appId = event.target.dataset.num;
        if(appId == 'CaseAnalysis')
            $A.util.removeClass(component.find("incDashboard"),'slds-hide');
        if(appId == 'Config')
            $A.util.removeClass(component.find("repScheduler"),'slds-hide');
        if(appId == 'OCA')
            $A.util.removeClass(component.find("SPDashboard"),'slds-hide');
        
        console.log('event.target.dataset.num' , event.target.dataset.num);
    },
    onBackClick: function(component, event, helper) {
        $A.util.removeClass(component.find("custTemp"),'slds-hide');
        $A.util.removeClass(component.find("custTem"),'slds-hide');
        helper.hideAllChildCmp(component, event, helper);
        
    }
})