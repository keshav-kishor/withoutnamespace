var {series, src, dest} = require('gulp');
var del = require('del');
var fs = require("fs");
var exec = require('child_process').exec;

var authAppName = 'auth-app';
var commonLibName = 'common-lib';
var authNgBuildDir = 'dist/auth-app/'
var authResource = 'CXoneAuth';
var sfdxDir = 'readiness-app/force-app/main/default/';
var sfdxPageDir = sfdxDir + 'pages/';
var sfdxResourcesDir = sfdxDir + 'staticresources/';

function clean_dir(callback) {
    var coverDir = 'coverage';
    var distDir = 'dist';
    var delOptions = {
        force: false,
        dryRun: false
    };
    del.sync([coverDir, distDir], delOptions);
    callback();
};

function transform_resource(ngBuildDir, htmlFile, staticResourceName, callback) {
    var htmlPath = ngBuildDir + htmlFile;
    del([htmlPath]).then( paths => {
        console.log('[ng->sfdx] Deleted file %s', paths.join('\n'));
        var staticResourcePath = sfdxResourcesDir + staticResourceName;
        console.log('[ng->sfdx] Clean staticResources %s ...', staticResourceName);
        del([staticResourcePath]).then( paths => {
            console.log('[ng->sfdx] Creating StaticResources ...');
            src(ngBuildDir + '**/*').pipe(dest(staticResourcePath));        
            console.log('[ng->sfdx] Creating StaticResources metadata ...');
            var resourceMetaPath = staticResourcePath + '.resource-meta.xml';
            var resourceMetaContent = `<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
<cacheControl>Private</cacheControl>
<contentType>application/zip</contentType>
</StaticResource>`;
            fs.writeFile(resourceMetaPath, resourceMetaContent, function(err) {
                if (err) {
                    throw err;
                }
                console.log('[ng->sfdx] StaticResources metadata created %s', resourceMetaPath);
                callback();
            });
        });
    });
};

function transform_ng_sf(ngBuildDir, htmlFile, pageName, pageDesc, apexController, staticResourceName, callback) {
    var htmlPath = ngBuildDir + htmlFile;
    /*
    fs.readFile(htmlPath, 'utf8', function(err, htmlContent) {
        if (err) {
            throw err;
        }
        var jsPatt = /\"([^\"]*.\.js)\"/gi;
        var cssPatt = /\"([^\"]*.\.css)\"/gi;
        var icoPatt = /\"([^\"]*.\.ico)\"/gi;
        var pagePath = sfdxPageDir + pageName + '.page';
        var pageMetaPath = pagePath + '-meta.xml';
        var apexPage ='<apex:page showheader="false" sidebar="false" standardStylesheets="false"'
        if (apexController) {
            apexPage = apexPage + ' controller="' + apexController + '"';
        }
        apexPage = apexPage + '>';
        //Replace HTML to apex:page tags
        var apexContent = htmlContent.replace('<html lang="en">', apexPage);
        apexContent = apexContent.replace('</html>', '</apex:page>');
        apexContent = apexContent.replace('<!doctype html>\n', '');
        apexContent = apexContent.replace('<!doctype html>', '');
        //Add static resource path for assets referring from the page
        function replacer(str, match, offset) {
            return '"{!URLFOR($Resource.' + staticResourceName + ', ' + "'" + match + "'" + ')}"';
        }
        apexContent = apexContent.replace(jsPatt, replacer);
        apexContent = apexContent.replace(cssPatt, replacer);
        apexContent = apexContent.replace(icoPatt, replacer);
        var apexMetaContent = `<?xml version="1.0" encoding="UTF-8"?>
<ApexPage xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>44.0</apiVersion>
    <availableInTouch>true</availableInTouch>
    <confirmationTokenRequired>false</confirmationTokenRequired>
    <description>PAGE__DESCRIPTION</description>
    <label>PAGE__LABEL</label>
</ApexPage>`;
        apexMetaContent = apexMetaContent.replace('PAGE__DESCRIPTION', pageDesc).replace('PAGE__LABEL', pageName);
        fs.writeFile(pagePath, apexContent, function(err) {
            if (err) {
                throw err;
            }
            console.log('[ng->sfdx] Converted apex page %s.', pagePath );
            fs.writeFile(pageMetaPath, apexMetaContent, function(err) {
                if (err) {
                    throw err;
                }
            });
            transform_resource(ngBuildDir, htmlFile, staticResourceName, callback);
        });
    });*/
    transform_resource(ngBuildDir, htmlFile, staticResourceName, callback);
};


function build_auth_app_ci(callback) {
    exec('ng build ' + authAppName + ' --configuration=ci', function(err, stdout, stderr) {
        if (err) {
            console.error('[ERROR] build %s failed, %s | %s | %s', authAppName, err.name, err.message, err.stack);
        }
        else {
            console.debug('[SUCCESS] build %s completed.', authAppName);
        }
        callback();
    });
};

function build_auth_app_dev(callback) {
    exec('ng build ' + authAppName + ' --configuration=dev', function(err, stdout, stderr) {
        if (err) {
            console.error('[ERROR] build %s failed, %s | %s | %s', authAppName, err.name, err.message, err.stack);
        }
        else {
            console.debug('[SUCCESS] build %s completed.', authAppName);
        }
        callback();
    });
};

function build_auth_app_sf(callback) {
    exec('ng build -c sf ' + authAppName + ' --configuration=sf', function(err, stdout, stderr) {
        if (err) {
            console.error('[ERROR] build %s failed, %s | %s | %s', authAppName, err.name, err.message, err.stack);
        }
        else {
            console.debug('[SUCCESS] build %s completed.', authAppName);
        }
        callback();
    });
};

function build_common_lib(callback) {
    exec('ng build ' + commonLibName  , function (err, stdout, stderr) {
        if (err) {
            console.error('[ERROR] build %s failed, %s | %s | %s', commonLibName, err.name, err.message, err.stack);
        }
        else {
            console.debug('[SUCCESS] build %s completed.', commonLibName);
        }
        callback();
    });
};


function transform_auth_app(callback) {
    transform_ng_sf(authNgBuildDir, 'index.html', 'authenticate', 'NICE inContact CXone Authentication page', 'AuthenticationController', authResource, callback);
};

//Gulp tasks for CircleCI
exports.ci_build_transform = series(clean_dir, build_common_lib, build_auth_app_ci, transform_auth_app);
//Default gulp tasks for dev
exports.default = series(clean_dir, build_common_lib, build_auth_app_dev, transform_auth_app);
//Gulp tasks for Salesforce
exports.sf_build_transform = series(clean_dir, build_common_lib, build_auth_app_sf, transform_auth_app);