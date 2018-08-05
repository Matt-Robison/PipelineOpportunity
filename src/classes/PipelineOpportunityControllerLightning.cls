//TODO-me - documentation
public with sharing class PipelineOpportunityControllerLightning {
    @AuraEnabled
    public static List<Opportunity> getChildOpportunities(String parentOpportunityId) {
        List <Opportunity> oppyList;

        oppyList = [
                SELECT Id, AccountId, Name, Amount, CloseDate, StageName, Type, C2parentopportunity__c, Description_Short__c, Description, CampaignId
                FROM Opportunity
                WHERE C2parentopportunity__c = :parentOpportunityId
                AND StageName != 'Created in error'
                ORDER BY CloseDate ASC
                LIMIT 10000
        ];

        return oppyList;
    }

    @AuraEnabled
    public static boolean updateOpportunities(List<Opportunity> editedOpportunityList) {
        try {
            update editedOpportunityList;
            return true;
        } catch (Exception e) {
            system.debug('Error: ' + e.getMessage());
            return false;
        }
    }

    //Bulk add method, adds bulkMonths to the close date each time it goes through the loop up to bulkNumber times
    @AuraEnabled
    public static Integer createChildOpportunities(Opportunity opportunity, String parentOpportunityId, Boolean bulkAdd, Integer bulkNumber, Integer bulkMonths) {
        //Lightning doesn't always pass a working Integer, recast to fix
        bulkNumber = Integer.valueOf(bulkNumber);
        bulkMonths = Integer.valueOf(bulkMonths);
        Integer numAdded = 0;

        //get opportunity we will use as a default base
        Opportunity toCopyOppy = getNewDefaultChildOpportunity(parentOpportunityId, opportunity);

        //if not bulk then we only want to add 1 opportunity
        if(!bulkAdd) {
            bulkNumber = 1;
            bulkMonths = 0;
        }

        List <Opportunity> newOppyList = new List <Opportunity>();

        //create each opportunity required by cloning default
        if (toCopyOppy != NULL) {
            for (Integer i = 0; i < bulkNumber; i++) {
                if (newOppyList.size() < bulkNumber) {
                    Opportunity newClone = toCopyOppy.clone(FALSE, TRUE, FALSE, FALSE);
                    newClone.CloseDate = toCopyOppy.CloseDate.addMonths(bulkMonths * i);
                    newOppyList.add(newClone);
                }
            }

            //insert child opportunities
            if (!newOppyList.isEmpty()) {
                try {
                    insert newOppyList;
                    numAdded = newOppyList.size();
                } catch (Exception e) {
                    System.debug('Error: inserting child opportunities - ' + e.getMessage());
                }
            }
        } else {
            System.debug('Error: toCopyOppy is NULL');
        }

        return numAdded;
    }

    //Bulk add method, adds bulkMonths to the close date each time it goes through the loop up to bulkNumber times
    @AuraEnabled
    public static Integer addMonths2CloseDate(String parentOpportunityId, String action, Integer months) {
        //Lightning doesn't always pass a working Integer, recast to fix
        months = Integer.valueOf(months);
        Integer numUpdated = 0;

        if(String.isNotEmpty(parentOpportunityId)) {
            List <Opportunity> oppyList = getChildOpportunities(parentOpportunityId);

            if(action.toLowerCase() == 'subtract') {months = months * -1;}

            if (!oppyList.isEmpty())
            {
                for (Opportunity ol :oppyList)
                {
                    ol.CloseDate = ol.CloseDate.addMonths(months);
                }
                update oppyList;
                numUpdated = oppyList.size();
            }
        } else {
            system.debug('Error: Parent id is empty');
        }

        return numUpdated;
    }

    //get Opportunity last close date PCO or if none exists get PPO
    private static Opportunity getNewDefaultChildOpportunity(String parentOpportunityId, Opportunity newOpportunity) {
        Opportunity oppy = NULL;

        //get last close date PCO or if none exists get PPO
        List<Opportunity> oppyList = [
                SELECT Id, AccountId, Name, Amount, CloseDate, StageName, Type, C2parentopportunity__c, Description_Short__c, Description, CampaignId
                FROM Opportunity
                WHERE
                (C2parentopportunity__c = :parentOpportunityId AND StageName != 'Created in error')
                OR
                Id = :parentOpportunityId
                ORDER BY C2parentopportunity__c NULLS LAST, CloseDate DESC
                LIMIT 1
        ];

        //ensure a record is returned
        if(!oppyList.isEmpty()) {
            oppy = oppyList[0];

            Id recordTypeChildId = getOpportunityRecordTypeId('Partnerships_Opportunity');
            oppy.RecordTypeId = recordTypeChildId;
            oppy.C2parentopportunity__c = parentOpportunityId;

            //loop through all populated fields in newOpportunity and copy to oppy
            Map<String, Object> fieldsToPopulate = newOpportunity.getPopulatedFieldsAsMap();
            for (String fieldName : fieldsToPopulate.keySet()) {
                oppy.put(fieldName, newOpportunity.get(fieldName));
            }
        } else {
            system.debug('Error: No record returned to copy');
        }

        return oppy;
    }

    private static Id getOpportunityRecordTypeId(String devName) {
        return Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get(devName).getRecordTypeId();
    }
}
