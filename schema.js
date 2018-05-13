const fetch = require('node-fetch')
const util = require('util')
const parseXML = util.promisify(require('xml2js').parseString)
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLList
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
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',
    fields: ()=>({
        title: {
            type: GraphQLString,
            resolve: xml => xml.title[0]
        },
        isbn: {
            type: GraphQLString,
        }
    })
})
const AuthorType = new GraphQLObjectType({
    name: "Author",
    description: "...",
    fields: () => ({
        name: {
            type: GraphQLString,
            resolve: xml => xml.GoodreadsResponse.author[0].name[0]
        },
        books: {
            type: new GraphQLList(BookType),
            resolve: xml => {
                logger.info("author books resolve")
                return xml.GoodreadsResponse.author[0].books[0].book

            }
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