const fs = require('fs')
const qs = require('querystring')
const crypto = require('crypto');
const Promise = require('bluebird')
const request = require('request')
const xmlParser = require('xml2js').parseString;
const signature = require('../../util/signature')

// Promisification
Promise.promisifyAll(fs)
Promise.promisifyAll(require('request'));

// Import config
const config = require('../../config/default')

// Read file contents 
fs.readFileAsync('./build/feed.xml', 'utf8')
    .then((data) => {
        submitFeed(data)
    })
    .catch((err) => {
        console.warn(err)
    });

// Submit data to endpoint 
function submitFeed(data) {

    const requestType = 'POST'
    const host = 'mws.amazonservices.com'
    const path = '/Feeds/2009-01-01'

    const query = {
        AWSAccessKeyId: config.AWSAccessKeyId,
        Action: 'SubmitFeed',
        FeedType: '_POST_PRODUCT_DATA_',
        SellerId: config.SellerId,
        SignatureMethod: 'HmacSHA256',
        SignatureVersion: '2',
        Timestamp: new Date().toISOString(),
        Version: '2009-01-01',
    }

    query.Signature = signature(requestType, host, path, query)

    const requestOptions = {
        url: `https://${host + path}`,
        headers: {
            Host: host,
            'User-Agent': 'feed-parser/0.0.1 (Language=JavaScript)',
            'Content-Type': 'text/xml',
            'Content-MD5': crypto.createHash('md5').update(data).digest('base64'),
        },
        qs: query,
        body: data
    }

    request.postAsync(requestOptions)
        .then((res) => {
            console.warn(res.body)
        })
        .catch((err) => {
            console.warn(err)
        });

}