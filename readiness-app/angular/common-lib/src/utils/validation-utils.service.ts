import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class ValidationUtilsService {

    isNotNullOrUndefined(value): boolean {
        if (value !== 'null' && value !== null && value !== 'undefined' && value !== undefined) {
            return true;
        }
        return false;
    }

    isNotNullOrEmpty(value): boolean {
        if (this.isNotNullOrUndefined(value) && value !== '') {
            return true;
        }
        return false;
    }

    isValidStationId(value) {
        const filter = /^[0-9]+$/;
        return filter.test(value);
    }

    isValidPhoneNumber(value) {
        const filter = /^(\+?)([0-9#\*])+$/;
        if (filter.test(value) && value.length <= 30) {
            return true;
        }
        return false;
    }

    isNullOrEmpty(value): boolean {
        return (value === undefined || value === null || value === '');
    }

    isNotNullOrEmptyArray(value) {
        if (value === undefined || value === null || value === ''
            || typeof value !== 'object' || !this.isNumber(value.length) || value.length === 0) {
            return false;
        }
        return true;
    }

    isNumber(value) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    isValidObject(value) {
        return value !== null && typeof value === 'object' && Object.keys(value).length > 0;
    }
}
