({
    //initialise datatable with columns and get child opportunities
    doInit : function(component, event, helper) {
        component.set('v.sourceRecordFields', [
            {label: 'Opportunity Name', fieldName: 'Name', editable:'true', type: 'text'},
            {label: 'Close Date', fieldName: 'CloseDate', editable:'true', type: 'date'},
            {label: 'Stage', fieldName: 'StageName', editable:'true', type: 'text'},
            {label: 'Description Short', fieldName: 'Description_Short__c', editable:'true', type: 'text'},
            {label: 'Campaign', fieldName: 'CampaignId', editable:'true', type: 'text'},
            {label: 'Amount', fieldName: 'Amount', editable:'true', type: 'currency'},
            {label: 'Description', fieldName: 'Description', editable:'true', type: 'text'},
            {label: 'Type', fieldName: 'Type', editable:'true', type: 'text'},
        ]);
        helper.getChildOpportunities(component, event, helper);
    },

    // reload child opportunity data
    reloadChildOpportunityData : function (component, event, helper) {
        helper.getChildOpportunities(component, event, helper);
    },

     // when save is pressed, call saveDataTable helper function to save modified records
    onSave : function (component, event, helper) {
        helper.saveDataTable(component, event, helper);
    },

    // open Add Opportunity Modal
    showAddOpportunity : function (component, event, helper) {
        var modalBody;
        var opptyRecordsList = component.get("v.sourceRecords");
        var defaultOppty;

        //if child opportunities, use last in the list to default for add data
        if(opptyRecordsList.length > 0) {
            defaultOppty = opptyRecordsList[opptyRecordsList.length - 1];
        } else {
            var parentOppty = component.get("v.parentOppty");

            // TODO-me default correct record type
            //create default opportunity based off Parent
            defaultOppty = { sobjectType: "Opportunity",
                Name: parentOppty.Name,
                C2parentopportunity__c: parentOppty.Id};
        }

        $A.createComponent(
            "c:PipelineOpportunityChildAdd",
            {
                defaultOppRecord: defaultOppty,
                //need to pass reference through for event/function otherwise event doesn't work from modal overlay component
                reloadChildOpportunityData: component.getReference("c.reloadChildOpportunityData")
            },
            function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "New Opportunity",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "mymodal"
                    })
                }
            });
    },

    // open Adjust Close Date Modal
    showAdjustCloseDate : function (component, event, helper) {
        var recordId = component.get("v.recordId");
        var modalBody;

        $A.createComponent(
            "c:PipelineOpportunityChildAdjustDate",
            {
                parentRecordId: recordId,
                //need to pass reference through for event/function otherwise event doesn't work from modal overlay component
                reloadChildOpportunityData: component.getReference("c.reloadChildOpportunityData")
            },
            function(content, status) {
                if (status === "SUCCESS") {
                    modalBody = content;
                    component.find('overlayLib').showCustomModal({
                        header: "Adjust Close Date",
                        body: modalBody,
                        showCloseButton: true,
                        cssClass: "mymodal"
                    })
                }
            });
    },
})