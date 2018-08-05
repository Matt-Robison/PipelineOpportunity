/**
 * Created by mattr on 30/07/2018.
 */

@IsTest
private class PipelineOpportunityControllerLightngTest {

    //check if we can get child opportunities
    @IsTest
    static void getChildOpportunities() {
        Integer numChildOpportunities = 20;
        Id parentId = createParentOpportunity();
        createChildOpportunities(numChildOpportunities, parentId);

        Test.startTest();
        List <Opportunity> oppyList = PipelineOpportunityControllerLightning.getChildOpportunities(parentId+'');
        Test.stopTest();

        System.assertEquals(numChildOpportunities, oppyList.size());
        System.assertNotEquals(oppyList[0].Id, oppyList[1].Id);
    }

    //check if we can update opportunities
    @IsTest
    static void canUpdateOpportunities() {
        Id parentId = createParentOpportunity();
        createChildOpportunities(2, parentId);

        List<Opportunity> oppCreatedList = [SELECT Amount, Description, StageName, RecordTypeId FROM Opportunity WHERE C2parentopportunity__c =:parentId];
        oppCreatedList[0].Amount = 402;
        oppCreatedList[1].Description = 'Great test';

        Test.startTest();
        PipelineOpportunityControllerLightning.updateOpportunities(oppCreatedList);
        Test.stopTest();

        List<Opportunity> oppCreatedListUpdated = [SELECT Amount, Description, StageName, RecordTypeId FROM Opportunity WHERE C2parentopportunity__c =:parentId];

        System.assertEquals(oppCreatedList[0].Amount, oppCreatedListUpdated[0].Amount);
        System.assertEquals(oppCreatedList[1].Description, oppCreatedListUpdated[1].Description);
    }

    //check creating single child opportunity from PPO with no children
    @IsTest
    static void createSingleChildOpportunityNoChildren() {
        Id parentId = createParentOpportunity();
        Opportunity opp = new Opportunity();
        opp.Amount = 802;
        opp.Description = 'testing desc update';

        Test.startTest();
        Integer numCreated = PipelineOpportunityControllerLightning.createChildOpportunities(opp, parentId, false, 0, 0);
        Test.stopTest();

        Id pcoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Partnerships_Opportunity').getRecordTypeId();
        List<Opportunity> oppCreatedList = [SELECT Amount, Description, StageName, RecordTypeId, C2parentopportunity__c FROM Opportunity WHERE C2parentopportunity__c =:parentId];

        System.assertEquals(1, numCreated);
        System.assertEquals(1, oppCreatedList.size());
        //check amount is overwritten
        System.assertEquals(opp.Amount, oppCreatedList[0].Amount);
        System.assertEquals(opp.Description, oppCreatedList[0].Description);
        System.assertEquals('Closed Won', oppCreatedList[0].StageName);
        System.assertEquals(pcoRecordTypeId, oppCreatedList[0].RecordTypeId);
        System.assertEquals(parentId, oppCreatedList[0].C2parentopportunity__c);
    }

    //check creating single child opportunity from PPO with children
    @IsTest
    static void createSingleChildOpportunityWithChildren() {
        Id parentId = createParentOpportunity();
        createChildOpportunities(5, parentId);
        Opportunity opp = new Opportunity();
        opp.Description = 'testing desc update';
        opp.CloseDate = date.today().addYears(2);

        Test.startTest();
        Integer numCreated = PipelineOpportunityControllerLightning.createChildOpportunities(opp, parentId, false, 0, 0);
        Test.stopTest();

        Id pcoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Partnerships_Opportunity').getRecordTypeId();
        List<Opportunity> oppCreatedList = [SELECT Amount, Description, StageName, RecordTypeId, CloseDate, C2parentopportunity__c FROM Opportunity WHERE C2parentopportunity__c =:parentId ORDER BY CloseDate DESC];

        System.assertEquals(1, numCreated);
        System.assertEquals(6, oppCreatedList.size());
        //check amount comes from copied opp
        System.assertEquals(100, oppCreatedList[0].Amount);
        System.assertEquals(opp.Description, oppCreatedList[0].Description);
        System.assertEquals('Closed Won', oppCreatedList[0].StageName);
        System.assertEquals(opp.CloseDate, oppCreatedList[0].CloseDate);
        System.assertEquals(pcoRecordTypeId, oppCreatedList[0].RecordTypeId);
        System.assertEquals(parentId, oppCreatedList[0].C2parentopportunity__c);
        //check exiting child records are correct
        System.assertEquals(date.today(), oppCreatedList[5].CloseDate);
    }

    //check creating bulk child opportunity from PPO with children
    @IsTest
    static void createBulkChildOpportunityWithChildrenBulk() {
        Id parentId = createParentOpportunity();
        createChildOpportunities(5, parentId);
        Opportunity opp = new Opportunity();
        opp.Description = 'testing desc update';
        opp.CloseDate = date.today().addYears(2);

        Test.startTest();
        Integer numCreated = PipelineOpportunityControllerLightning.createChildOpportunities(opp, parentId, true, 5, 2);
        Test.stopTest();

        Id pcoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('Partnerships_Opportunity').getRecordTypeId();
        List<Opportunity> oppCreatedList = [SELECT Amount, Description, StageName, RecordTypeId, CloseDate, C2parentopportunity__c FROM Opportunity WHERE C2parentopportunity__c =:parentId ORDER BY CloseDate DESC];

        System.assertEquals(5, numCreated);
        System.assertEquals(10, oppCreatedList.size());
        //check amount comes from copied opp
        System.assertEquals(100, oppCreatedList[0].Amount);
        //check description is overwritten with new values
        System.assertEquals(opp.Description, oppCreatedList[0].Description);
        System.assertEquals('Closed Won', oppCreatedList[0].StageName);
        System.assertEquals(pcoRecordTypeId, oppCreatedList[0].RecordTypeId);
        //check close dates
        System.assertEquals(opp.CloseDate.addMonths(8), oppCreatedList[0].CloseDate);
        System.assertEquals(opp.CloseDate.addMonths(6), oppCreatedList[1].CloseDate);
        System.assertEquals(opp.CloseDate.addMonths(4), oppCreatedList[2].CloseDate);
        System.assertEquals(opp.CloseDate.addMonths(2), oppCreatedList[3].CloseDate);
        System.assertEquals(opp.CloseDate, oppCreatedList[4].CloseDate);
        System.assertEquals(parentId, oppCreatedList[0].C2parentopportunity__c);
        //check existing record close date
        System.assertEquals(date.today(), oppCreatedList[5].CloseDate);
    }

    //check if we can update all child opportunity close dates
    @IsTest
    static void updateMonths2CloseDateAdd() {
        Integer numChildOpportunities = 5;
        Id parentId = createParentOpportunity();
        createChildOpportunities(numChildOpportunities, parentId);

        Test.startTest();
        Integer numUpdated = PipelineOpportunityControllerLightning.addMonths2CloseDate(parentId+'', 'Add', 2);
        Test.stopTest();

        List <Opportunity> oppyList = PipelineOpportunityControllerLightning.getChildOpportunities(parentId+'');

        System.assertEquals(numChildOpportunities, numUpdated);
        System.assertNotEquals(date.today().addMonths(10), oppyList[0].CloseDate);
        System.assertNotEquals(date.today().addMonths(2), oppyList[4].CloseDate);
    }

    //create set number of child opportunities
    private static void createChildOpportunities(Integer numChildOpps, Id parentId) {
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
    private static Id createParentOpportunity() {
        Id ppoRecordTypeId  = Schema.SObjectType.Opportunity.getRecordTypeInfosByDeveloperName().get('PartnershipsParentOpportunity').getRecordTypeId();

        Opportunity o = new Opportunity(Name = 'name',StageName ='Closed Won',CloseDate = date.today(),RecordTypeId = ppoRecordTypeId,SystemRequireTransactionHandling__c = 'No');

        insert o;
        return o.Id;
    }
}