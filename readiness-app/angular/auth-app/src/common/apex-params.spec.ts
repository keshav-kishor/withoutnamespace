import { ApexParams } from './apex-params';

describe('ApexParams', () => {
    it('Set false if icRememberMe not defined', () => {
        const expected = {
            namespacePrefix: 'test',
            icUsername: 'test@hc8.com',
            authCallbackUrl: 'http://localhost:4201/authenticate/apex/authcallback',
            resourceBase: '.',
            langCode: 'en_US'
        };
        sessionStorage.setItem('initParam', JSON.stringify(expected));
        const actual = ApexParams.init();
        expect(actual.icRememberMe).toBeFalsy();
    });

    it('init values by sessionStorage', () => {
        const expected = {
            namespacePrefix: 'test',
            icUsername: 'test@hc8.com',
            icRememberMe: true,
            authCallbackUrl: 'http://localhost:4201/authenticate/apex/authcallback',
            resourceBase: '.',
            langCode: 'en_US'
        };
        sessionStorage.setItem('initParam', JSON.stringify(expected));
        const actual = ApexParams.init();
        expect(actual.langCode).toBe(expected.langCode);
        expect(actual.resourceBase).toBe(expected.resourceBase);
    });

    it('init values by default', () => {
        // Remove the initParam from session Storage for default initialization
        sessionStorage.removeItem('initParam');
        const defaultLang = 'en_US';
        const defaultResource = '.';
        const actual = ApexParams.init();
        expect(actual.langCode).toBe(defaultLang);
        expect(actual.resourceBase).toBe(defaultResource);
    });
});
