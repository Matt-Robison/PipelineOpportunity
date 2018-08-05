({
    //update child opportunities close date to apex controller
    updateClick: function(component, event, helper) {
        var parentRecordId =  component.get("v.parentRecordId");
        var theAction = component.get("v.selectedAction");
        var months = component.get("v.monthsAdjust");

        helper.setButtonUpdating(component, event, helper);
        helper.updateChildOpportunityCloseDates(component, helper, parentRecordId, theAction, months);
    },
    //close the modal window
    closeModal: function(component, event, helper) {
        helper.closeModal(component, event, helper);
    },
})