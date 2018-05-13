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
const BookType = new GraphQLObjectType({
    name: 'Book',
    description: '...',
    fields: () => ({
        title: {
            type: GraphQLString,
            resolve: xml => {
                logger.info("book title xml", JSON.stringify(xml, null, "\t"))
                const title=xml.GoodreadsResponse.book[0].title[0]
                logger.info("book title", title)
                return title;
            }
        },
        isbn: {
            type: GraphQLString,
            resolve: xml => {
                logger.info("book isbn xml", xml)
                const isbn = xml.GoodreadsResponse.book[0].isbn[0]
                logger.info("book isbn", isbn)
                return isbn
            }
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
                const ids = xml.GoodreadsResponse.author[0].books[0].book.map(elem => {
                        logger.info("elem", elem);
                        return elem.id[0]._
                    }
                )
                logger.info("ids", ids)
                return Promise.all(ids.map(id => {
                        const url = `https://www.goodreads.com/book/show/${id}.xml?key=${apiKey}`
                        logger.info(`requresting url`, url);
                        return fetch(url)
                            .then(response => response.text())
                            .then(parseXML)
                    }
                ))
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