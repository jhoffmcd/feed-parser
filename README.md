# Feed Parser

This is a demo of how to parse one format of data from an endpoint into another form of data and output a file.

## Notes:

* Test assumes XML source
* Test assumes JSON output

## Options

```bash
-u --url                Source URL to request
```

## Usage

Simply run the `index.js` file in `node` with the required URL argument.

`node index.js -u http://your.feed.here/stuff.xml`
