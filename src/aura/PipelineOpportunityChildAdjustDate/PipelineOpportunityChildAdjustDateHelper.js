({
    // called when Save is clicked. Passes records to APEX controller for upsert
    updateChildOpportunityCloseDates : function(component, helper, parentRecordId, theAction, months) {
        var action = component.get("c.addMonths2CloseDate");

        action.setParams({
            'parentOpportunityId' : parentRecordId,
            'action' : theAction,
            'months' :  months
        });

        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //if save is successful more than 0 are returned
                var numUpdated = response.getReturnValue();
                if(numUpdated > 0){
                    var oppName = "Opportunity";
                    if(numUpdated > 1) oppName = "Opportunities";

                    //fire event to update the child Opportunities datalist
                    var reloadDataEvent = component.getEvent("reloadChildOpportunityData");
                    reloadDataEvent.fire();

                    component.find("utilityUIFunctions").showToastSuccess(component, "Success!", numUpdated + " " + oppName + " Updated");
                } else{ //if update failed
                    component.find("utilityUIFunctions").showToastError(component, "Error!", "No opportunities updated");
                }
            } else {
                component.find("utilityUIFunctions").showToastError(component, "Error!", "Error in update");
            }

            //close modal and display result, do not close before firing event or it won't fire
            helper.closeModal(component, event, helper);
        });
        $A.enqueueAction(action);
    },

    closeModal: function(component, event, helper) {
        //display bulk toggle on fields loaded
        component.find("overlayLib").notifyClose();
    },

    //disable button and set spinner
    setButtonUpdating : function (component, event, helper) {
        component.find("update").set("v.disabled", true);
        component.find("utilityUIFunctions").showLoading(component);
    },
})