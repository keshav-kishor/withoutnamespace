import { Injectable } from '@angular/core';
import { DatastoreKeys } from '../enums/data-store-keys';

@Injectable({
  providedIn: 'root'
})
export abstract class StorageService {

  public abstract get(key: DatastoreKeys): string;

  public abstract set(key: DatastoreKeys, val: string);

  public abstract remove(key: DatastoreKeys);

}
