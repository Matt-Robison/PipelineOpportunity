({
    // get ppo record type id
    getPPORecordTypeId : function(component, event, helper) {
        var action = component.get("c.getPPORecordTypeId");

        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var recordTypeId = response.getReturnValue();

                component.set("v.recordTypeId", recordTypeId);
            }
        });
        $A.enqueueAction(action);
    },
    showHide : function(component) {
        component.find("utilityUIFunctions").toggleBetweenComponents(component, "viewCard", "editCard");
    }
})