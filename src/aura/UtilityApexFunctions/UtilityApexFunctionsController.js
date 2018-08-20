({
    callApex: function(component, event, helper){
        var params = event.getParams().arguments;
        var sourceComponent = params.sourceComponent;
        var methodName = params.methodName;
        var actionParameters = params.actionParameters;
        var successCallbackFunction = params.successCallbackFunction;
        var finalCallbackFunction = params.finalCallbackFunction;
        var helperFunctions = params.helperFunctions;
        helper.callApex(sourceComponent, methodName, actionParameters, successCallbackFunction, finalCallbackFunction, helperFunctions);
    }
})