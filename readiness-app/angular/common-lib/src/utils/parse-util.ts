export class ParseUtil {
    static toBoolean(value): boolean {
        return value !== null && value !== undefined && value.toLowerCase() === 'true';
    }

    static toNumber(value) {
        if (value !== null && value !== undefined && isNaN(value) === false) {
            return parseInt(value, 10);
        }
        return 0;
    }

    static formatPhoneNumber(phoneNumber) {
        const format = /^(\d{3})(\d{3})(\d{4})$/;
        const match = phoneNumber.match(format);
        if (match) {
            return phoneNumber.replace(format, '($1) $2-$3');
        }
        return phoneNumber;
    }
}
