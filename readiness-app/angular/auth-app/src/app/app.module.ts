import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { environment } from '../environments/environment';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApexParams } from '../common/apex-params';
import { LoginSuccessComponent } from './login-success/login-success.component';

const initParam = ApexParams.init();

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginSuccessComponent
  ],
  imports: [
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG }),
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, initParam.resourceBase + '/assets/i18n/'),
        deps: [HttpClient]
      }
    })
  ],
  providers: [{provide: 'AuthenticationService', useClass: environment.authenticationService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
