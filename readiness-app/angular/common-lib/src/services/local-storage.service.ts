import { Injectable } from '@angular/core';
import { DatastoreKeys } from '../enums/data-store-keys';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  public get(key: DatastoreKeys): string {
    return localStorage.getItem(key);
  }

  public set(key: DatastoreKeys, val: string) {
    return localStorage.setItem(key, val);
  }

  public remove(key: DatastoreKeys) {
    return localStorage.removeItem(key);
  }

  public clear() {
    return localStorage.clear();
  }
}
