# NICE-inContact Einstein App
Einstein App is an app based on Salesforce Einstein module to explore data from InContact reports combined with Salesforce objects. Using this app, inhouse data scientist will analyze the data using inbuilt Dashboard and Lenses.
They can also use Einstein Discovery(Stories) for predections.

## Developer Notes
Please see [Developer Setup](/docs/dev-setup.md) documentation for initial setup.

### SFDX Commands
> *This is one time step,* login to NICE inContact org marks as default dev-hub org and set alias name as 'ic-dev-hub'
```
sfdx force:auth:web:login -a ic-dev-hub -d
```

Create a developer scratch org from Dev-Hub org marks as default developer org and set alias name as 'my-dev-scratch'. 
Please note the maximum duration for scratch org is 30 days. We are setting 25 days to match our sprint duration and 4 days
```
sfdx force:org:create -f config/agent-dev-scratch.json -s -a my-dev-scratch -d 25
```

Open the developer scratch org in browser, to push/pull source code and test the code in Salesforce org
```
sfdx force:org:open -u my-dev-scratch
```
### Project Code Structure
* /config/ - SFDX scratch org definition files
* /docs/ - Documentation folder
* /data/base - Base data for setup
* /data/sample - Sample CASE and OPPORTUNITY data set for basic org setup ** Only for TESTING
* /readiness-app - All setup code including authentication
* /einstein-app - Actual Einstein Analytics related code.

#### force-app source code
npm install
npm run gulp sf_build_transform
sfdx force:source:convert -r readiness-app/force-app --outputdir build/readiness-app
sfdx force:source:convert -r einstein-app --outputdir build/einstein-app
sfdx force:auth:web:login -r "https://test.salesforce.com"
sfdx force:mdapi:deploy --deploydir build/readiness-app --targetusername kk@pqa.com.einstein
Profile -> Analytics Cloud Integration User -> FLS -> Task -> inContact_IncontactId --> Edit Access

sfdx force:mdapi:deploy --deploydir build/einstein-app --targetusername kk@pqa.com.einstein
Enable my domain
Assign "CXone Analytics" permission set for current user

### For Authentication for Central
* Custom Settings ->Authentication Settings -> New -> User -> Authentication URL -> https://api-sc11.ucnlabext.com/InContactAuthorizationServer/Token
* Change authorization url specific to Cental cluster used.

### Changes required in Dev Org to view Einstein App
* Setup -> Analytics -> Analytics -> Settings -> Enable Data Sync and Connections 
* Enable My Domain
* Assign CXone Analytics permission set to the user
* /data > Import all files using dataloader.io
* Add Remote Site Settings
* Change token for B2 cluster or URl

## Resources
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/)
- [Salesforce DX Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/)
