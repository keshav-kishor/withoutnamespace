import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { URLUtilsService } from 'common-lib';

@Injectable({
  providedIn: 'root'
})
export class NavigationUtilService {

  constructor(private router: Router, private urlUtilSvc: URLUtilsService) { }

  private getDefaultNavigationExtras(): NavigationExtras {
    const navigationExtras: NavigationExtras = {
      queryParams: this.urlUtilSvc.parseQueryString(window.location.search),
      skipLocationChange: true
    };
    return navigationExtras;
  }

  navigate(commands: any[], extras?: NavigationExtras) {
    this.router.navigate(commands, extras ? extras : this.getDefaultNavigationExtras());
  }
}
