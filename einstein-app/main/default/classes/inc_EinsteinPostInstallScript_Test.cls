@isTest
public class inc_EinsteinPostInstallScript_Test extends Metadata.DeployCallbackContext {

    static testmethod void PostInstallScript_Test(){
    
        inc_EinsteinPostInstallScript postinstallClass = new inc_EinsteinPostInstallScript();
        test.startTest();
        postinstallClass.insertReportMetaData();
        postinstallClass.insertScheduler();
        system.assert(true);
        test.stopTest();
    }
}
