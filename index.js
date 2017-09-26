const http = require('http')
const fs = require('fs')
const program = require('commander');
const parseString = require('xml2js').parseString;

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
      
      parseString(body, function (err, result) {
          fs.writeFileSync('./feed.json', JSON.stringify(result))
          console.info('feed.json file written succesfully.');
          process.exit(0);
      });
      
    })
  })

} else {
  console.error('No feed URL specified, please use "-u" or "--url" flag to pass URL string.')
  process.exit(1);
}