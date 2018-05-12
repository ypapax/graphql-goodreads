const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString
} = require('graphql')
const logger = require('tracer').colorConsole();

const apiKey = process.env.GOOD_READS_API_KEY
logger.info("apiKey", apiKey);
// api key can be generated here https://www.goodreads.com/api/keys
/*fetch(
    'https://www.goodreads.com/author/show.xml?id=4432&key='+apiKey
)
    .then(response => response.text())
    .then(parseXML)*/
const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "...",
    fields: () => ({
        name: {
            type: GraphQLString
        }
    })
})
module.exports = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: '...',
        fields: () => ({
            author: {
                type: AuthorType,
                args: {
                    id: {type: GraphQLInt}
                },
                resolve: (root, args) => {
                    const url = `https://www.goodreads.com/author/show.xml?id=${args.id}&key=${apiKey}`;
                    logger.info("url", url);
                    return fetch(url)
                        .then(response => response.text())
                        .then(parseXML)
                }
            }
        })
    })
})