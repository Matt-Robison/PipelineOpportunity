# Pipeline Opportunity Management - Lightning Components
Custom Lightning Application allowing easy opportunity pipeline management of ongoing donations. Business requirement was to manage via a single page and not having page refreshing that happened in older Visualforce solution.

Use Case is a donation manager adding a business who will be making significant monthly donations and needs tracking within their opportunity pipeline.

**Right panel shows overall parent opportunity. Left panel shows ongoing monthly donations.**
![pipeline overview](https://user-images.githubusercontent.com/42108324/53407078-7007f180-3a0f-11e9-9058-11867522220e.png)

**Modal popup to manage custom pipeline changes**
![modal popup custom logic](https://user-images.githubusercontent.com/42108324/53407653-c75a9180-3a10-11e9-95a0-75bb35e5d717.png)

**Real time swapping from Read Mode to Edit Mode of parent Opportunity**
![read only - edit swapping](https://user-images.githubusercontent.com/42108324/53407671-d0e3f980-3a10-11e9-9eef-42d5bd9e0116.png)

**Inline table editing of child ongoing donation**
![inline editing](https://user-images.githubusercontent.com/42108324/53407687-d80b0780-3a10-11e9-943b-3d8925915f98.png)

**Lightning App Builder compatible with separate components interacting via Events**
![lightning app builder](https://user-images.githubusercontent.com/42108324/53407698-e0fbd900-3a10-11e9-9ad5-9c778a2a2a15.png)

## Technical Notes
* Component Modelling used, 4 independent components created. Parent Opportunity Read/Edit, Child Opportunities List, Add Child Opportunity (modal popup) and Adjust Date (modal popup)
* Uses combination of both Application and Component Events, along with Attribute passing to communicate between components
* Modal popup components
* Common Utility library components used across all components, controls common features like animation Loader eg. UtilityUIFunctions.js
* Lightning Data Service to read/edit parent opportunity
