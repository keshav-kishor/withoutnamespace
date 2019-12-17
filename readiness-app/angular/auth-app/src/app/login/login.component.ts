import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from './email-validator';
import { ApexParams } from './../../common/apex-params';
import {
	AuthToken,
	AccessTokenService,
	LocalStorageService,
	DatastoreKeys,
	ValidationUtilsService,
	URLUtilsService,
	SessionStorageService,
	LoggerService,
	AuthenticateSettings
} from 'common-lib';
import { OpenIDConfig } from '../../model/open-id-config.model';
import { ErrorMessage } from '../../model/error-message.model';
import { AuthenticationService } from '../../services/authentication.service';
import * as LCC from 'lightning-container';
import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { NavigationUtilService } from '../../services/navigation-util.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'auth-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.scss' ]
})
export class LoginComponent implements OnInit {
	private authSettings: AuthenticateSettings;
	private openIDConfig: OpenIDConfig;
	private openIdAuthRequestStateParam: number;
	private defaultPwdIcon = 'preview';
	initParam: ApexParams;

	loginForm: any;
	showLogin = true;
	isExternalAuthenticationEnabled = false;
	isCentralAuthenticationEnabled = false;
	errorMessage = new ErrorMessage();
	canShowPwd = false;
	canShowSpinner = true;
	pwdIcon = this.defaultPwdIcon;
	isForgotPassword = false;
	areaURLs: any;
	areaMapping = [
		{name: 'na1', abbrev: 'North America'},
		{name: 'au1', abbrev: 'Australia'},
		{name: 'eu1', abbrev: 'Frankfurt'},
		{name: 'Central', abbrev: 'Central'},
		{name: 'naDev', abbrev: 'North America Dev'},
	];

	selectedArea: any = 'na1';
	isCentral: Boolean;

	get username() {
		return this.loginForm.get('username');
	}

	get password() {
		return this.loginForm.get('password');
	}

	get rememberMe() {
		return this.loginForm.get('rememberMe');
	}

	get area() {
		return this.loginForm.get('area');
	}

	constructor(
		@Inject('AuthenticationService') private authService: AuthenticationService,
		private accessTokenSvc: AccessTokenService,
		private fb: FormBuilder,
		private localStorageSvc: LocalStorageService,
		private sessionStorageSvc: SessionStorageService,
		private logger: LoggerService,
		private urlUtilSvc: URLUtilsService,
		private validationUtilSvc: ValidationUtilsService,
		private navigationUtilSvc: NavigationUtilService,
		private sanitizer: DomSanitizer
	) {}

	ngOnInit() {
		this.logger.log(LoginComponent.name, 'Login component initialize');
		this.initParam = ApexParams.init();
		this.createLoginForm();

		this.canShowSpinner = false;
		this.isCentralAuthenticationEnabled = true;
		this.areaURLs =  {
			'na1': 'https://na1.nice-incontact.com',
			'au1': 'https://au1.nice-incontact.com',
			'eu1': 'https://eu1.niceincontact.com',
			'Central': 'Central',
			'naDev': 'https://na1.dev.nice-incontact.com'
		  };
	}

	private createLoginForm() {
		this.logger.log(LoginComponent.name, 'Create login Form');
		let username = '';
		let rememberMe = false;
		let area = 'na1';

		if (this.validationUtilSvc.isNotNullOrUndefined(this.initParam.icUsername)) {
			username = this.initParam.icUsername;
		}
		if (this.validationUtilSvc.isNotNullOrUndefined(this.initParam.icRememberMe)) {
			rememberMe = this.initParam.icRememberMe;
		}
		this.loginForm = this.fb.group({
			username: [ username, [ Validators.required, EmailValidator ] ],
			password: [ '', [ Validators.required ] ],
			rememberMe: [ rememberMe ],
			area: [area]
		});
	}

	togglePassword() {
		this.canShowPwd = !this.canShowPwd;
		this.pwdIcon = this.canShowPwd ? 'hide' : this.defaultPwdIcon;
		this.logger.debug(LoginComponent.name, 'toggle password ' + this.canShowPwd);
	}

	canDisableSignIn(): boolean {
		let disable = true;
		if (this.username.errors === null && this.password.errors === null && this.area.errors === null) {
			disable = false;
		}
		return disable;
	}

	authenticateUser() {
		this.logger.log(LoginComponent.name, 'Authenticate user entry');
		this.errorMessage.centralError = '';
		const areaUrl = this.areaURLs[this.area.value];

		this.localStorageSvc.set(DatastoreKeys.EvolveWebServerUrl, areaUrl);
		this.authService.authenticateUser(this.username.value, this.password.value, areaUrl).then(
			(response: AuthToken) => {
				this.logger.debug(LoginComponent.name, 'Authenticate user success ' + response);
				this.accessTokenSvc.setAccessToken(response);
				this.localStorageSvc.set(DatastoreKeys.AdminUserName, this.username.value);
				this.navigationUtilSvc.navigate(['/loginSuccess']);
			},
			(error) => {
				this.logger.error(LoginComponent.name, 'Authenticate user error ' + error);
				this.errorMessage.centralError = error;
			}
		);
	}

	private redirectToSFComp() {
		this.loginForm = false;
		window.location.href =
			window.location.ancestorOrigins[0] +
			'/lightning/n/' +
			this.initParam.namespacePrefix +
			'__InContact_Analytics?c__login=success';
	}


	recoverPassword() {
		window.open(
			this.authSettings.forgotPassword,
			'targetWindow',
			'scrollbars=yes, resizable=yes, width=600px, height=600px, left=400px, top=40px'
		);
	}

	hideAuthSettingsError() {
		this.errorMessage.authSettingsError = '';
	}

	getBackground() {
		const image = this.initParam.resourceBase + '/assets/images/background-pattern.svg';
		return this.sanitizer.bypassSecurityTrustStyle(`url(${image}),linear-gradient(rgba(0, 158, 218), rgba(0, 124, 190))`);
	}
}
