({
    getChildOpportunities : function(component, event, helper) {
        var parentOpportunityId = component.get("v.recordId");
        var action = component.get("c.getChildOpportunities");

        component.find("utilityUIFunctions").showLoading(component);

        action.setParams({
            'parentOpportunityId' : parentOpportunityId
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.sourceRecords", response.getReturnValue());
            }

            component.find("utilityUIFunctions").hideLoading(component);
        });
        $A.enqueueAction(action);
    },

    // called when Save is clicked. Passes records to APEX controller for upsert
    saveDataTable : function(component, event, helper) {
        var editedRecords =  component.find("opportunitiesDataTable").get("v.draftValues");
        var totalRecordEdited = editedRecords.length;
        var action = component.get("c.updateOpportunities");
        action.setParams({
            'editedOpportunityList' : editedRecords
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //if update is successful
                if(response.getReturnValue() === true){
                    component.find("utilityUIFunctions").showToastSuccess(component, "Success!", totalRecordEdited + " Opportunities Updated");
                    helper.reloadDataTable();
                } else{ //if update failed
                    component.find("utilityUIFunctions").showToastError(component, "Error!", "Error in update");
                }
            }
        });
        $A.enqueueAction(action);
    },

    // reload data table
    reloadDataTable : function(){
        var refreshEvent = $A.get("e.force:refreshView");
        if(refreshEvent){
            refreshEvent.fire();
        }
    },
})