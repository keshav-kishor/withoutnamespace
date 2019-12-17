import { Injectable } from '@angular/core';
import { DatastoreKeys } from '../enums/data-store-keys';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService implements StorageService {

  public get(key: DatastoreKeys): string {
    return sessionStorage.getItem(key);
  }

  public set(key: DatastoreKeys, val: string) {
    return sessionStorage.setItem(key, val);
  }

  public remove(key: DatastoreKeys) {
    return sessionStorage.removeItem(key);
  }
}
