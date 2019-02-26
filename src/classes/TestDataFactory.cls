/*-----------------------------------------------------------------------------------------
Author: Matt Robison
Description : Class to help generating test data
/*-----------------------------------------------------------------------------------------*/

@IsTest
public class PipelineOpportunityControllerLightngTest {
    //create set number of child opportunities
    public static void createChildOpportunities(Integer numChildOpps, Id parentId) {
        Id pcoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Partnerships_Opportunity').getRecordTypeId();
        List <Opportunity> oppList = new List<Opportunity>();

        for(Integer i = 0; i < numChildOpps; i++) {
            Opportunity o = new Opportunity(Name = 'child name ' + i,StageName ='Closed Won',CloseDate = date.today().addMonths(i),SystemRequireTransactionHandling__c = 'No',Amount=100,
            C2parentopportunity__c = parentId, RecordTypeId = pcoRecordTypeId, Description='Sample Desc ' + i);

            oppList.add(o);
        }

        insert oppList;
    }

    //create a parent opportunity
    public static Id createParentOpportunity() {
        Id ppoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('PartnershipsParentOpportunity').getRecordTypeId();

        Opportunity o = new Opportunity(Name = 'name',StageName ='Closed Won',CloseDate = date.today(),RecordTypeId = ppoRecordTypeId,SystemRequireTransactionHandling__c = 'No');

        insert o;
        return o.Id;
    }
}
