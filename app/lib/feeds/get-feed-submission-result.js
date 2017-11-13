const signature = require('../../util/signature')
const request = require('request')
const Promise = require('bluebird')

// Promisification
Promise.promisifyAll(require('request'))

// Import config
const config = require('../../config/default')

/**
 * getFeedSubmissionResult retrieves report on completed submissions
 * 
 * http://docs.developer.amazonservices.com/en_CA/feeds/Feeds_GetFeedSubmissionResult.html
 */
function getFeedSubmissionResult(id) {

    const requestType = 'POST'
    const host = 'mws.amazonservices.com'
    const path = '/Feeds/2009-01-01'

    const query = {
        AWSAccessKeyId: config.AWSAccessKeyId,
        Action: 'GetFeedSubmissionResult',
        FeedSubmissionId: id,
        SellerId: config.SellerId,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: '2',
        Timestamp: new Date().toISOString(),
        Version: '2009-01-01'
    }

    query.Signature = signature(requestType, host, path, query)

    const requestOptions = {
        url: `https://${host + path}`,
        headers: {
            Host: host,
            'User-Agent': 'feed-parser/0.0.1 (Language=JavaScript)',
            'Content-Type': 'text/xml',
        },
        qs: query
    }

    request.postAsync(requestOptions)
        .then((res) => {
            console.warn(res.body)
        })
        .catch((err) => {
            console.warn(err)
        });
        
}

// TODO: this function should pass a submission ID.
getFeedSubmissionResult()