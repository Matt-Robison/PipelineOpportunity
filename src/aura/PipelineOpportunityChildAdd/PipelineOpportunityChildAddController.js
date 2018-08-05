/**
 * Created by mattr on 23/07/2018.
 */
({
    //close the modal window
    closeModal: function(component, event, helper) {
        helper.closeModal(component);
    },
    handleLoaded: function(component, event, helper) {
        //display bulk toggle on fields loaded
        $A.util.removeClass(component.find("bulkToggle"), "slds-hide");
        component.find("utilityUIFunctions").hideLoading(component);
    },

    handleBulkToggleClick: function(component, event, helper) {
        //make text fields visible
        $A.util.toggleClass(component.find("bulkNumberLayout"), "slds-hide");
        $A.util.toggleClass(component.find("bulkMonthsLayout"), "slds-hide");
    },

    //save opportunity to apex controller
    saveClick: function(component, event, helper) {
        var parentOppRecordId =  component.get("v.defaultOppRecord").C2ParentOpportunity__c;
        var bulkAddProperties = component.get("v.bulkAddProperties");

        //create opportunity object for saving
        var opp = {'sobjectType':'Opportunity',
                    'Amount':component.find("Amount").get("v.value"),
                    'Description':component.find("Description").get("v.value"),
                    'CloseDate':component.find("CloseDate").get("v.value"),
                    'StageName':component.find("StageName").get("v.value")
                    };

        helper.setButtonSaving(component, event, helper);
        helper.saveChildOpportunityBulk(component, helper, opp, parentOppRecordId, bulkAddProperties["bulkAdd"], bulkAddProperties["bulkNumber"], bulkAddProperties["bulkMonths"]);
    },
})