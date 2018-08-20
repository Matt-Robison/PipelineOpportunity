({
    callApex: function (component, methodName, params, successCallback, finalCallback, helperFunctions) {
        var action = component.get(methodName);
        action.setParams(params);
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                callback(component, helperFunctions, response.getReturnValue());
            }
            else if (state === "INCOMPLETE") {
                // do something
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                            errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
            finalCallback(component, helperFunctions);
        });
        $A.enqueueAction(action);
    }
})