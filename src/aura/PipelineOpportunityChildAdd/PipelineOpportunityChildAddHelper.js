/**
 * Created by mattr on 23/07/2018.
 */
({
    // called when Save is clicked. Passes records to APEX controller for upsert
    saveChildOpportunityBulk : function(component, helper, opportunity, parentRecordId, bulkAdd, bulkNumber, bulkMonths) {
        var action = component.get("c.createChildOpportunities");
        action.setParams({
            'opportunity' : opportunity,
            'parentOpportunityId' : parentRecordId,
            'bulkAdd' : bulkAdd,
            'bulkNumber' : bulkNumber,
            'bulkMonths' : bulkMonths
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //if save is successful more than 0 are returned
                var numAdded = response.getReturnValue();
                if(numAdded > 0){
                    var oppName = "Opportunity";
                    if(numAdded > 1) oppName = "Opportunities";

                    //fire event to update the child Opportunities datalist
                    var reloadDataEvent = component.getEvent("reloadChildOpportunityData");
                    reloadDataEvent.fire();

                    component.find("utilityUIFunctions").showToastSuccess(component, "Success!", numAdded + " " + oppName + " Added");
                } else{ //if update failed
                    component.find("utilityUIFunctions").showToastError(component, "Error!!", "Error in update");
                }
            } else {
                component.find("utilityUIFunctions").showToastError(component, "Error!!", "Error in update");
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
    setButtonSaving : function (component, event, helper) {
        component.find("save").set("v.disabled", true);
        component.find("utilityUIFunctions").showLoading(component);
    },
})