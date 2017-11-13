const crypto = require('crypto')
const qs = require('querystring')

// Import config
const config = require('../config/default')

/**
 * Signature utility function: Returns a signed version of the parameters for authentication purposes on Amazon's side.
 * 
 * http://docs.developer.amazonservices.com/en_CA/dev_guide/DG_ClientLibraries.html#DG_ClientLibraries__Signatures
 * 
 * @param {String} requestType 
 * @param {String} host 
 * @param {String} path 
 * @param {Object} params 
 * @returns {String}
 */
module.exports = (requestType, host, path, params) => {

    // Build unsigned string.
    const unsigned = [requestType, host, path, qs.stringify(params)].join('\n')

    // Further URL encoding, not sure why... but it works.
    unsigned
        .replace(/'/g, "%27")
        .replace(/\*/g, "%2A")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29")

    // Return signed string. 
    return crypto
        .createHmac('sha256', config.SecretKey)
        .update(unsigned)
        .digest('base64')

}