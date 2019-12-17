import { TestBed } from '@angular/core/testing';
import { NavigationUtilService } from './navigation-util.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationExtras } from '@angular/router';
import { NGXLogger, NGXLoggerHttpService, LoggerConfig } from 'ngx-logger';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('NavigationUtilService', () => {
    let service: NavigationUtilService;
    let router: Router;

    beforeEach(
        () => {
            TestBed.configureTestingModule({
                imports: [
                    RouterTestingModule.withRoutes([])
                  ],
                providers: [NGXLogger, NGXLoggerHttpService, LoggerConfig, HttpClient, HttpHandler]
            });
            service = TestBed.get(NavigationUtilService);
            router = TestBed.get(Router);
        }
    );

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should invoke the router navigate method with the skip location change parameter set to true while navigation', () => {
        const url = '/home';
        const navigateSpy = spyOn(router, 'navigate').and.callFake((arg1, arg2) => {
            expect(arg1[0]).toEqual(url);
            expect(arg2.skipLocationChange).toBe(true);
        });
        service.navigate([url]);
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('should invoke the router navigate method with the arguments passed while navigation', () => {
        const url = '/home';
        const navigateSpy = spyOn(router, 'navigate').and.callFake((arg1, arg2) => {
            expect(arg1[0]).toEqual(url);
            expect(arg2.skipLocationChange).toBe(false);
        });
        const navigationExtras: NavigationExtras = {
            skipLocationChange: false
          };
        service.navigate([url], navigationExtras);
        expect(navigateSpy).toHaveBeenCalled();
    });
});
