({
    //show green success toast message
    showToastSuccess: function(component, event, helper){
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;
        var title = params.title;
        var message = params.message;

        helper.showToastSuccess(sourceComponent, helper, title, message);
    },
    //show red error toast message
    showToastError: function(component, event, helper){
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;
        var title = params.title;
        var message = params.message;

        helper.showToastError(sourceComponent, helper, title, message);
    },
    //show spinner
    showLoading : function (component, event, helper) {
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;

        sourceComponent.set("v.loading", true);
    },
    //hide spinner
    hideLoading : function (component, event, helper) {
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;

        sourceComponent.set("v.loading", false);
    },
    //toggle between showing and hiding 2 components
    toggleBetweenComponents : function(component, event, helper) {
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;
        var firstComponentName = params.firstComponentName;
        var secondComponentName = params.secondComponentName;

        helper.toggleBetweenComponents(sourceComponent, firstComponentName, secondComponentName);
    }
})