({
	doInit : function(cmp, event, helper) {
        
            $A.util.addClass(cmp.find("SPDashboard"),'slds-hide');
       
    },
    onSPAppClick: function( cmp, event,  h ){
        console.log( ' SP App click');
        $A.util.removeClass(cmp.find("SPDashboard"),'slds-hide');
        $A.util.addClass(cmp.find("backBtn"), 'slds-hide');
        $A.util.addClass(cmp.find("custFCRTempDet"), 'slds-hide');
		$A.util.addClass(cmp.find("backBtnHeader"), 'slds-hide');
    },
    onSPBackClick: function(cmp, event, helper) {
        console.log('BackClick FCR ');
         var cmpEvent = $A.get("e.c:inc_CategoryDetailBack");
            //cmpEvent.setParams({'selCategory':selReportId});
            cmpEvent.fire();
    },
})