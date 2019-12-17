import { TestBed } from '@angular/core/testing';
import { ValidationUtilsService } from './validation-utils.service';

describe('ValidationUtilsService', () => {
    let service: ValidationUtilsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
        });
        service = TestBed.get(ValidationUtilsService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('check for valid station id', () => {
        const value = '12345';
        const res = service.isValidStationId(value);
        expect(res).toBe(true);
    });

    it('check for valid phone number', () => {
        const value = '4005150001';
        const res = service.isValidPhoneNumber(value);
        expect(res).toBe(true);
    });

    it('check for invalid phone number', () => {
        const value = '4005150001a';
        const res = service.isValidPhoneNumber(value);
        expect(res).toBe(false);
    });

    it('check for value is null or empty', () => {
        const value = '4005150001';
        const res = service.isNullOrEmpty(value);
        expect(res).toBe(false);
    });

    it('check for value is null or empty for an array having array values', () => {
        const value =
            [{
                IndicatorId: '0',
                MessageHint: '',
                MessageId: '1475',
                MessageText: '<p>hai</p>',
                Subject: '1',
                ValidUntil: '2019-05-14T12:38:00.000Z',
                start_date: '2019-05-14T12:28:55.000Z'
            }];
        const res = service.isNotNullOrEmptyArray(value);
        expect(res).toBe(true);
    });

    it('check for value is null or empty for an array having empty values', () => {
        const value = [];
        const res = service.isNotNullOrEmptyArray(value);
        expect(res).toBe(false);
    });

    it('check is valid object', () => {
        const value = {IndicatorId: '0'};
        const res = service.isValidObject(value);
        expect(res).toBe(true);
    });
});
