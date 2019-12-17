import { Injectable } from '@angular/core';
import { LoggerService } from '../services/logger.service';

@Injectable({
    providedIn: 'root'
})

export class URLUtilsService {

    constructor(private logger: LoggerService) {
    }

    appendQueryString(url, map) {
        let queryString = '';
        let key = '';

        for (key in map) {
            if (map.hasOwnProperty(key)) {
                if (queryString !== '') {
                    queryString += '&';
                }
                queryString += key + '=' + encodeURIComponent(map[key]);
            }
        }

        if (url.indexOf('?') === -1) {
            url += (queryString === '') ? queryString : '?' + queryString;
        } else {
            url += (queryString === '') ? queryString : '&' + queryString;
        }
        return url;
    }

    getParameterByName(queryStr, name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(queryStr);
        return results == null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    isValidURL(url) {
        const validURL = /((?:https?\:\/\/|www\.)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i;
        return validURL.test(url);
    }

    addParamToQueryString(params: string) {
        let queryString = window.location.search;
        if (queryString === '') {
            queryString = '?';
        } else {
            queryString += '&';
        }
        queryString += params;
        return queryString;
    }

    parseQueryString(queryString: string) {
        const params = {};
        try {
            if (typeof queryString !== 'string') {
                return params;
            }

            if (queryString.charAt(0) === '?') {
                queryString = queryString.slice(1);
            }

            if (queryString.length === 0) {
                return params;
            }

            const pairs = queryString.split('&');
            for (let i = 0; i < pairs.length; i++) {
                const pair = pairs[i].split('=');
                params[pair[0]] = !!pair[1] ? decodeURIComponent(pair[1]) : null;
            }
        } catch (e) {
            this.logger.error(URLUtilsService.name, 'Error in parsing query string -' + e.message);
        }
        return params;
    }

    getHostName(url) {
        if (url) {
            const formattedUrl = new URL(url).hostname;
            return formattedUrl;
        }
        return '';
    }

    isSFDomain(hostname) {
        const forceDomainPatt = /\.force\.com$/i;
        const visualforceDomainPatt = /\.visualforce\.com$/i; // Salesforce Spring 18 release has this domain
        const sfDomainPatt = /\.salesforce\.com/i;
        if (forceDomainPatt.test(hostname) || sfDomainPatt.test(hostname) || visualforceDomainPatt.test(hostname)) {
            return true;
        }

        return false;
    }

    parseUrl(url) {
        const urlDom = document.createElement('a');
        urlDom.href = url;

        return {
            search: urlDom.search
        };
    }
}
