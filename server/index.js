
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
# Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
    id: ID!
    title: String
    author: String
}

# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
    books(skip: Int): [Book]
}

`;

const books = Array.from({ length: 200 }, (_, i) => ({
    id: String(i),
    title: `Book ${i}`,
    author: `Author ${i}`,
}));

const resolvers = {
    Query: {
        books: async (_,{skip}) => {
            await sleep(1000);
            console.info(`Querying books with skip: ${skip}`);
            return books.slice(skip || 0, skip ? skip + 10 : 10);
        },
    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
});

console.log(`🚀  Server ready at: ${url}`);