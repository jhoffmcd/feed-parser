# MWS JavaScript Helpers

This project is an attempt to organize a set of standard exportable functions that can interface with source data and export/transform that data for MWS consumption. It's not an SDK, the purpose is to create a toolkit that easily allows developers to take a feed, apply necessary modifications or transformation to that feed data, and submit it in complience with MWS guidelines.

It's still missing most of the feed helper functions. So far it has just been tested with feed submissions.

** This highly untested and conceptual at this point. It is not reccommended that you use this as a production ready tool. **

## Table of Contents

<!-- toc -->

- [Requirements](#requirements)
- [Options](#options)
- [Usage](#usage)

<!-- tocstop -->

## Requirements

* Node 6
* Amazon seller account or developer account with access to seller account to keys

## Options

```bash
-u --url                Source URL to request
```

## Usage

Make sure you have a config file setup with the appropriate access keys. The config file is not tracked, but you can find an example config file in `app/config/example.default.js`.

Simply run the `index.js` file in `node` with the required URL argument.

`node index.js -u http://your.feed.here/stuff.xml`