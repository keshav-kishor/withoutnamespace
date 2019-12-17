import { TestBed } from '@angular/core/testing';
import { ParseUtil } from './parse-util';

describe('ParseUtil', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ParseUtil]
        });
    });

    it('should be created', () => {
        expect(ParseUtil).toBeTruthy();
    });

    it('to boolean or not', () => {
        const value = 'True';
        const res = ParseUtil.toBoolean(value);
        expect(res).toBe(true);
    });

    it('for valid number', () => {
        const value = '123456987';
        const res = ParseUtil.toNumber(value);
        expect(res).toBe(123456987);
    });

    it('for not a number', () => {
        const value = '@';
        const res = ParseUtil.toNumber(value);
        expect(res).toBe(0);
    });

    it('to get formatted phone number', () => {
        const phoneNumber = '4005150001';
        const formatedNumber = ParseUtil.formatPhoneNumber(phoneNumber);
        expect(formatedNumber).toEqual('(400) 515-0001');
    });

    it('not format if phone number length is more than 10', () => {
        const phoneNumber = '+14005150001';
        const formatedNumber = ParseUtil.formatPhoneNumber(phoneNumber);
        expect(formatedNumber).toEqual(phoneNumber);
    });
});
