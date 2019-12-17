import { TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AuthcallbackComponent } from './authcallback/authcallback.component';
import { SalesforceAuthenticationService } from '../services/salesforce-authentication.service';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/'),
            deps: [HttpClient]
          }
        })
      ],
      declarations: [
        AppComponent,
        LoginComponent,
        AuthcallbackComponent
      ],
      providers: [NGXLogger, NGXLoggerHttpService, LoggerConfig,
        {provide: 'AuthenticationService', useClass: SalesforceAuthenticationService}]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'auth-app'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('auth-app');
  });
});
