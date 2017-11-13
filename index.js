const http = require('http')
const fs = require('fs')
const program = require('commander');
const xml2js = require('xml2js');

// Import config
const config = require('./app/config/default')

console.info('-------- Feed Parser Test --------')

// Process command line arguments using command module.
program
  .version('0.0.1')
  .option('-u, --url [url]', 'Feed source')
  .parse(process.argv)

console.info('Feed URL: %j', program.url)

// Perform check on valid feed URL passed.
if (program.url) {

  const url = program.url

  // Peform native node HTTP request.
  http.get(url, res => {
    res.setEncoding('utf8')

    // Initialize document body.
    let body = ''

    // On data response, concat body.
    res.on('data', data => {
      body += data
    })

    // On data end, parse and map data and output to json file.
    res.on('end', () => {

      xml2js.parseString(body, function (err, result) {
        const feedObject = result.Datafeed.Items[679]
        console.log(feedObject)
        const builderOpts = {
          rootName: 'AmazonEnvelope'
        }

        const productMapping = {
          SKU: feedObject.Product_Number,
          DescriptionData: {
            Title: feedObject.Product_Name,
            Description: feedObject.Long_Description,
            PackageWeight: {
              _: feedObject.Weight,
              $: {
                unitOfMeasure: 'LB'
              }
            },
            MSRP: feedObject.Suggested_Retail_Price,
            Manufacturer: feedObject.Manufacturer            
          }
        }

        const feedEnvelope = {
          $: {
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xsi:noNamespaceSchemaLocation': 'amznenvelope.xsd'
          },
          Header: {
            DocumentVersion: 1.01,
            MerchantIdentifier: config.SellerId
          },
          MessageType: 'Product',
          PurgeAndReplace: true,
          Message: {
            MessageID: 1,
            OperationType: 'PartialUpdate',
            Product: productMapping
          }
        }

        var builder = new xml2js.Builder(builderOpts)

        const feedEnvelopeXML = builder.buildObject(feedEnvelope);

        fs.writeFileSync('./build/feed.xml', feedEnvelopeXML)
        console.info('feed.xml file written succesfully.');
        process.exit(0);
      });

    })
  })

} else {
  console.error('No feed URL specified, please use "-u" or "--url" flag to pass URL string.')
  process.exit(1)
}