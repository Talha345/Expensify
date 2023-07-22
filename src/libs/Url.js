import {URL_WEBSITE_REGEX} from 'expensify-common/lib/Url';
import 'react-native-url-polyfill/auto';

/**
 * Add / to the end of any URL if not present
 * @param {String} url
 * @returns {String}
 */
function addTrailingForwardSlash(url) {
    if (!url.endsWith('/')) {
        return `${url}/`;
    }
    return url;
}

/**
 * Parse href to URL object
 * @param {String} href
 * @returns {Object}
 */
function getURLObject(href) {
    const urlRegex = new RegExp(URL_WEBSITE_REGEX, 'gi');
    const match = urlRegex.exec(href);
    if (!match) {
        return {
            href: undefined,
            protocol: undefined,
            hostname: undefined,
            path: undefined,
        };
    }
    const baseUrl = match[0];
    const protocol = match[1];
    return {
        href,
        protocol,
        hostname: baseUrl.replace(protocol, ''),
        path: href.startsWith(baseUrl) ? href.replace(baseUrl, '') : '',
    };
}

/**
 * Determine if we should remove w3 from hostname
 * E.g www.expensify.com should be the same as expensify.com
 * @param {String} hostname
 * @returns {Boolean}
 */
function shouldRemoveW3FromExpensifyUrl(hostname) {
    // Since expensify.com.dev is accessible with and without www subdomain
    if (hostname === 'www.expensify.com.dev') {
        return true;
    }
    const parts = hostname.split('.').reverse();
    const subDomain = parts[2];
    return subDomain === 'www';
}

/**
 * Determine if two urls have the same origin
 * Just care about expensify url to avoid the second-level domain (www.example.co.uk)
 * @param {String} url1
 * @param {String} url2
 * @returns {Boolean}
 */
function hasSameExpensifyOrigin(url1, url2) {
    const host1 = getURLObject(url1).hostname;
    const host2 = getURLObject(url2).hostname;
    if (!host1 || !host2) {
        return false;
    }
    const host1WithoutW3 = shouldRemoveW3FromExpensifyUrl(host1) ? host1.replace('www.', '') : host1;
    const host2WithoutW3 = shouldRemoveW3FromExpensifyUrl(host2) ? host2.replace('www.', '') : host2;
    return host1WithoutW3 === host2WithoutW3;
}

function getPathFromDevURL(url) {
    if (!url) {
        return undefined;
    }
    const path = new URL(url).pathname;
    return path.substring(1); // Remove the leading '/'
}

function hasSameOrigin(url1, url2) {
    if (!url1 || !url2) {
        return false;
    }
    const host1 = new URL(url1).host;
    const host2 = new URL(url2).host;
    return host1 === host2;
}

export {
    // eslint-disable-next-line import/prefer-default-export
    addTrailingForwardSlash,
    hasSameExpensifyOrigin,
    getURLObject,
    getPathFromDevURL,
    hasSameOrigin,
};
