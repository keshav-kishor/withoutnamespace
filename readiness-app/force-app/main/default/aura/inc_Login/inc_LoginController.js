({
	doInit : function(component, event, helper) {
        component.set('v.loginPage','../../apex/authenticate2');
	},
    getAccessToken: function( component, event,  h ){
        var payload = event.getParams().payload;
        var name = payload.name;
        if (name === "accessToken") {
            var value = payload.value;
            component.set('v.accessToken', value);
            console.log(component.get('v.accessToken'));
        }
    }
})