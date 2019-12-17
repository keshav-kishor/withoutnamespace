#!groovy
import groovy.json.JsonSlurperClassic
node {

    def BUILD_NUMBER=env.BUILD_NUMBER
    def RUN_ARTIFACT_DIR="tests/${BUILD_NUMBER}"
    def SFDC_USERNAME

    def HUB_ORG=env.HUB_ORG_DH
    def SFDC_HOST = env.SFDC_HOST_DH

	//def CODECOV_TOKEN = env.CODECOV_TOKEN
	def CODECOV_TOKEN = "3943cadb-6695-411c-82c2-24d2bd4bdbf7"

    println HUB_ORG
    println SFDC_HOST

    properties([parameters([choice(choices: 'DEV\nQA1\nQA2\nSTAGING\nPROD', description: 'Select Environment for deployment', name: 'ENV')])])
    def environment = "${params.ENV}"
    echo "selected environment:: ${environment}"
	
	
	def props = readProperties  file:'jenkins.properties'
	def CONNECTED_APP_CONSUMER_KEY= props["${environment}"]
	echo "CONNECTED_APP_CONSUMER_KEY = ${CONNECTED_APP_CONSUMER_KEY}"

	
   stage('Checkout SCM') 
        {
                checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'pratibha-ssh-github', url: 'git@github.com:inContact/SFEinstein.git']]])
        }
	
   stage('Installing dependency packages') {
	   if (isUnix()) {
       		testMsg = sh returnStdout: true, script: "npm install"
	   } else {
		testMsg = bat returnStdout: true, script: "npm install"
	   }
    }

	stage('Apex Test Execution') {
		echo "Authenticating to Salesforce DevHub"
		if (isUnix()) {
			rc = sh returnStatus: true, script: "npm run sfdx -- force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile keys/devhub.key --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
		}else{
				rc = bat returnStatus: true, script: "npm run sfdx -- force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile keys/devhub.key --setdefaultdevhubusername --setalias DevHubOrg --instanceurl ${SFDC_HOST}"
		}
		if (rc != 0) { error 'hub org authorization failed' }

		echo "Creating Salesforce Scratch org"
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run sfdx -- force:org:create --definitionfile config/project-scratch-def.json --setdefaultusername --setalias CI-Scratch-Org"
		}else{
			rmsg = bat returnStdout: true, script: "npm run sfdx -- force:org:create --definitionfile config/project-scratch-def.json --setdefaultusername --setalias CI-Scratch-Org"
		}

		echo "Push source to Salesforce Scratch org"
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run sfdx -- force:source:push --targetusername=CI-Scratch-Org"
		}else{
			rmsg = bat returnStdout: true, script: "npm run sfdx -- force:source:push --targetusername=CI-Scratch-Org"
		}

		echo "Executing Salesforce apex unit-tests"
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run sfdx -- force:apex:test:run --targetusername=CI-Scratch-Org --codecoverage --resultformat junit --outputdir coverage/force --wait 10"
		}else{
			rmsg = bat returnStdout: true, script: "npm run sfdx -- force:apex:test:run --targetusername=CI-Scratch-Org --codecoverage --resultformat junit --outputdir coverage/force --wait 10"
		}

		echo "Uploading codecoverage to Codecov"
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run codecov -- --token=${CODECOV_TOKEN}"
		}else{
			rmsg = bat returnStdout: true, script: "npm run codecov -- --token=${CODECOV_TOKEN}"
		}

		echo "Delete scratch org"
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run sfdx -- force:org:delete --targetusername=CI-Scratch-Org --noprompt"
		}else{
			rmsg = bat returnStdout: true, script: "npm run sfdx -- force:org:delete --targetusername=CI-Scratch-Org --noprompt"
		}

	}


	stage('Deploy Source Code') {
		echo "Authenticating to Salesforce Package Org"
		if (isUnix()) {
			rc = sh returnStatus: true, script: "npm run sfdx -- force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile keys/devhub.key --setdefaultdevhubusername --instanceurl ${SFDC_HOST}"
		}else{
				rc = bat returnStatus: true, script: "npm run sfdx -- force:auth:jwt:grant --clientid ${CONNECTED_APP_CONSUMER_KEY} --username ${HUB_ORG} --jwtkeyfile keys/devhub.key --setdefaultdevhubusername --setalias DevHubOrg --instanceurl ${SFDC_HOST}"
		}
		if (rc != 0) { error 'hub org authorization failed' }
		println rc
		
		if (isUnix()) {
			rmsg = sh returnStdout: true, script: "npm run sfdx -- force:mdapi:deploy -d build/readiness-app/. -u ${HUB_ORG}"
		}else{
			println('-->Creating package structure for readiness-app...')
			rmsg = bat returnStdout: true, script: "npm run sfdx --  force:source:convert -r readiness-app/force-app --outputdir build/readiness-app"
			println('SUCCESS:: Package structure for readiness-app Created!!')
			println('-->Creating package structure for einstein-app...')
			rmsg = bat returnStdout: true, script: "npm run sfdx --   force:source:convert -r einstein-app --outputdir build/einstein-app"
			println('SUCCESS:: Package structure for einstein-app Created!!')
			println('Deploying readiness-app to the org')
			rmsg = bat returnStdout: true, script: "npm run sfdx --  force:mdapi:deploy -d build/readiness-app/. -u ${HUB_ORG}"
			deploymsg = bat returnStdout: true, script: "npm run sfdx --  force:mdapi:deploy:report -u ${HUB_ORG}"
			
		}
			
		printf rmsg
		println('*****NICE inContact CI Job*****')
		println(rmsg)
		println(deploymsg)
		
	}
    
	stage('Send Email') {
		emailext ( 
		   subject: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
		   body: """SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':
		 Check console output at '${env.BUILD_URL}${env.JOB_NAME} [${env.BUILD_NUMBER}]'""",
		   to: 'keshav.kishor@nice.com'
		 )
	}
}
