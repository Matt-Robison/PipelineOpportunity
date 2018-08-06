({
    //show green success toast message
    showToastSuccess: function(component, helper, title, message) {
        this.showToast(component, title, message, "success");
    },
    //show red error toast message
    showToastError: function(component, helper, title, message) {
        this.showToast(component, title, message, "error");
    },
    //show toast message of specified type
    showToast: function(component, title, message, type) {
        var showToast = $A.get("e.force:showToast");
        if(showToast) {
            showToast.setParams({
                title : title,
                message : message,
                type: type
            });
            showToast.fire();
        } else {
            alert(message);
        }
    },
    //toggle between showing and hiding 2 components
    toggleBetweenComponents : function(component, firstComponentName, secondComponentName) {
        var firstComponent = component.find(firstComponentName);
        $A.util.toggleClass(firstComponent, "slds-hide");
        var secondComponent = component.find(secondComponentName);
        $A.util.toggleClass(secondComponent, "slds-hide");
    }
})