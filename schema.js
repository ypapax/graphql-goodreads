const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
// api key can be generated here https://www.goodreads.com/api/keys
const x = fetch(
    'https://www.goodreads.com/author/show.xml?id=4432&key=NsLXXc9qa7gXA5m5N83PYA'
)
    .then(response => response.text())
    .then(parseXML)
x