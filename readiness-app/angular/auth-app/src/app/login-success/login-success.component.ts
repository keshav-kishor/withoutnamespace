import { Component, OnInit, Inject } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import {
	AccessTokenService, LocalStorageService, SessionStorageService,
	LoggerService, URLUtilsService, ValidationUtilsService, DatastoreKeys
} from 'common-lib';
import { NavigationUtilService } from '../../services/navigation-util.service';
import { FormBuilder } from '@angular/forms';
import { ErrorMessage } from '../../model/error-message.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ApexParams } from '../../common/apex-params';
import { HttpWrapperService } from '../../services/http-wrapper.service';

@Component({
	selector: 'auth-login-success',
	templateUrl: './login-success.component.html',
	styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {


	constructor(@Inject('AuthenticationService') private authService: AuthenticationService,
		private accessTokenSvc: AccessTokenService,
		private fb: FormBuilder,
		private localStorageSvc: LocalStorageService,
		private sessionStorageSvc: SessionStorageService,
		private logger: LoggerService,
		private urlUtilSvc: URLUtilsService,
		private validationUtilSvc: ValidationUtilsService,
		private navigationUtilSvc: NavigationUtilService,
		private sanitizer: DomSanitizer,
		private httpWrapper: HttpWrapperService) { }

	initParam: ApexParams;
	createUser = false;
	createUserSuccess = false;
	createAccesskey = false;
	accessKeySuccess = false;
	userName: String;
	errorMsg: any;
	errorMessage = new ErrorMessage();

	ngOnInit() {
		this.initParam = ApexParams.init();
		if (this.isCentral()) {
			this.userRegistrationCentral();
		} else {
			this.getTenatId();
			this.userRegistrationUH();
		}
	}
	getTenatId() {
		this.authService.getTenatId().then(
			(response) => {
				this.localStorageSvc.set(DatastoreKeys.TenantId, response.tenantId);
				this.logger.debug(LoginSuccessComponent.name, 'getTenatId success: tennantId:: ' + response.tenantId);
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'getTenatId error' + error);
				this.errorMessage.authSettingsError = error;
				this.errorMsg = error;
			});
	}

	private userRegistrationCentral() {
		this.logger.debug(LoginSuccessComponent.name, 'inside userRegistrationCentral');
		const buName = this.accessTokenSvc.getAccessToken().businessUnit;
		const userName = 'Albert@' + buName + '.com';
		this.createUser = true;
		this.userName = userName;

		this.authService.getAgentInfo(this.localStorageSvc.get(DatastoreKeys.AdminUserName)).then(
			(response) => {
				this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral in login component - ' + JSON.stringify(response));
				const payload = {
					"agents": [
						{
							"firstName": "Albert",
							"lastName": "Einstein",
							"emailAddress": response.emailAddress,
							"country": response.country,
							"profileId": response.profileId,
							"teamId": response.teamId.toString(),
							"userName": userName,
							"timeZone": response.timeZone,
							"city": response.city,
							//"Password" : "Password",
							"userType": "Agent",
							"state": response.state
						}
					]
				};
				this.authService.userRegistration(payload, this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl)).then(
					(response) => {
						this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral in login component - ' + JSON.stringify(response));
						if (response.errorCount == 0) {
							this.localStorageSvc.set(DatastoreKeys.NewUserId, response.agentResults[0].agentId);
							this.createUser = false;
							this.createUserSuccess = true;
							this.createAccessKeyAPI();
						} else if (response.errorCount == 1) {
							if (response.agentResults[0].error.indexOf('Password must be supplied') != -1) {
								this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral : Not an Admin User.');
								this.errorMessage.authSettingsError = response.agentResults[0].error;
								this.errorMsg ='Please login with Admin user Credentials.';
								
							} else if (response.agentResults[0].error.indexOf('unique') != -1) {
								this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral : User already created.');
								this.createUser = false;
								this.createUserSuccess = true;
								this.authService.getAgentInfo(userName).then(
									(response) => {
										this.localStorageSvc.set(DatastoreKeys.NewUserId, response.agentId);
										this.createAccessKeyAPI();
									});
							} else {
								this.errorMessage.authSettingsError = response.agentResults[0].error;
								this.errorMsg = response.agentResults[0].error;
							}
						}
					},
					(error) => {
						this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral error' + error);
						this.errorMessage.authSettingsError = response.agentResults[0].error;
						this.errorMsg = response.agentResults[0].error;
					}
				);
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'userRegistrationCentral error' + error);
				this.errorMessage.authSettingsError = error;
				this.errorMsg = error;
			}
		);
	}

	private userRegistrationUH() {
		this.logger.debug(LoginSuccessComponent.name, 'inside userRegistrationUH');
		const buName = this.accessTokenSvc.getAccessToken().businessUnit;
		const userName = 'Albert@' + buName + '.com';
		this.createUser = true;
		this.userName = userName;

		this.authService.getUserInfo(userName).then(
			(response) => {
				const payload = {
					"firstName": "Albert",
					"lastName": "Einstein",
					"emailAddress": response.adminUser.emailAddress,
					"country": response.adminUser.country,
					"role": "Agent",
					"userName": userName
				};
				if(response.NewUserId!= '') {
					this.logger.debug(LoginSuccessComponent.name, 'userRegistrationUH: User already present');
					this.localStorageSvc.set(DatastoreKeys.NewUserId, response.NewUserId);
					this.createUser = false;
					this.createUserSuccess = true;
					if(response.status !== 'ACTIVE') {
						this.activateUser(userName, this.localStorageSvc.get(DatastoreKeys.AdminUserName).toLowerCase());
					} else {
						this.createAccessKeyAPI();
					}
				} else {
					this.authService.userRegistration(payload, this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl)).then(
						(response) => {
							this.logger.debug(LoginSuccessComponent.name, 'userRegistrationUH in login component - ' + JSON.stringify(response));
							this.localStorageSvc.set(DatastoreKeys.NewUserId, response.uuid);
							this.createUser = false;
							this.createUserSuccess = true;
							this.activateUser(userName, this.localStorageSvc.get(DatastoreKeys.AdminUserName).toLowerCase());
						},
						(error) => {
							this.logger.debug(LoginSuccessComponent.name, 'userRegistrationUH error' + error);
							this.errorMessage.authSettingsError = error.error.details;
							this.errorMsg = error.error.details;
						}
					);
				}
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'getUserInfo error' + error);
				this.errorMessage.authSettingsError = error.error.details;
				this.errorMsg = error.error.details;
			}
		);
		
	}
	activateUser(emailAddressesList: string, senderEmail: string) {
		this.logger.debug(LoginSuccessComponent.name, 'inside activateUser');
		this.authService.activateUser(emailAddressesList, senderEmail).then(
			(response) => {
				this.logger.debug(LoginSuccessComponent.name, 'activateUser in login success component : Activation mail sent to the Admin User!');
				this.createAccessKeyAPI();
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'activateUser error' + error);
				this.errorMessage.authSettingsError = error;
				this.errorMsg = error;
			}
		);
	}

	createAccessKeyAPI() {
		this.logger.debug(LoginSuccessComponent.name, 'inside createAccessKeyAPI');
		this.createAccesskey = true;
		this.authService.createAccessKeyAPI(this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl)).then(
			(response) => {
				this.logger.debug(LoginSuccessComponent.name, 'createAccessKeyAPI in login success component - ' + JSON.stringify(response));
				this.localStorageSvc.set(DatastoreKeys.AccessSecretKey, JSON.stringify(response));
				this.createAccesskey = false;
				this.storeAccessAndSecretKey();
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'createAccessKeyAPI error' + error);
				this.errorMessage.authSettingsError = error;
				this.errorMsg = error;
			}
		);
	}
	storeAccessAndSecretKey() {
		this.logger.debug(LoginSuccessComponent.name, 'inside storeAccessAndSecretKey');
		this.authService.storeAccessAndSecretKey().then(
			(response) => {
				this.logger.debug(LoginSuccessComponent.name, 'storeAccessAndSecretKey in login component - ' + JSON.stringify(response));
				console.log("woooo... I acheived it!");
				this.accessKeySuccess = true;
			},
			(error) => {
				this.logger.debug(LoginSuccessComponent.name, 'storeAccessAndSecretKey error' + error);
				this.errorMessage.authSettingsError = error;
				this.errorMsg = error;
			}
		);
	}

	getBackground() {
		const image = this.initParam.resourceBase + '/assets/images/background-pattern.svg';
		return this.sanitizer.bypassSecurityTrustStyle(`url(${image}),linear-gradient(rgba(0, 158, 218), rgba(0, 124, 190))`);
	}

	isCentral() {
		return this.localStorageSvc.get(DatastoreKeys.EvolveWebServerUrl) === 'Central';
	}

}
