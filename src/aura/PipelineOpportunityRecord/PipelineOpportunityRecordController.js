({
    //initialise data
    doInit : function(component, event, helper) {
        helper.getPPORecordTypeId(component, event, helper);
    },
    // hide read view and open edit view
    edit: function(component, event, helper) {
        helper.showHide(component);
    },
    // hide edit view and show read only
    cancel: function(component, event, helper) {
        helper.showHide(component);
    },
    // navigate to pipeline url
    myPipeline: function(component, event, helper) {
        var urlEvent = $A.get("e.force:navigateToURL");
        urlEvent.setParams({
            "url":"/apex/PipelineOpportunitiesListAll"
        });
        urlEvent.fire();
    },
    handleLoaded: function(component, event, helper) {
        component.find("utilityUIFunctions").hideLoading(component);
    },
    submitForm: function(component, event, helper) {
        component.find("utilityUIFunctions").showLoading(component);
        component.find("editForm").submit();
    },
    handleSavedNew: function(component, event, helper) {
        component.find("utilityUIFunctions").showToastSuccess(component, "Success!", "Opportunity Created");
        component.find("utilityUIFunctions").hideLoading(component);

        //fire event to update the child Opportunities
        var appEvent = $A.get("e.c:PipelineOpportunity_aevt_ReloadChildren");
        appEvent.fire();
    },
    handleSavedEdit: function(component, event, helper) {
        component.find("utilityUIFunctions").showToastSuccess(component, "Success!", "Opportunity Saved");
        component.find("utilityUIFunctions").hideLoading(component);
        helper.showHide(component);

        //fire event to update the child Opportunities
        var appEvent = $A.get("e.c:PipelineOpportunity_aevt_ReloadChildren");
        appEvent.fire();
    },
    copyStageToChildren: function(component, event, helper) {
        var checked = event.ln.checked;
        var oppId =  component.get("v.recordId");
        var sObjectOppArray = [{ sobjectType: 'Opportunity',
            Id: oppId,
            CopyCloseDatetoChildOpportunities__c: checked
        }];

        var action = component.get("c.updateOpportunities");
        action.setParams({
            'editedOpportunityList' : sObjectOppArray
        });
        action.setCallback(this,function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //if update is successful
                if(response.getReturnValue() === true) {
                    component.find("utilityUIFunctions").showToastSuccess(component, "Success!", " Opportunities Created");
                    helper.reloadDataTable();
                } else { //if update failed
                    component.find("utilityUIFunctions").showToastError(component, "Error!!", "Error in update");
                }
            }
        });
        $A.enqueueAction(action);
    }
})