const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLFloat,
    // GraphQLNonNull
} = require('graphql');
const { getAllDocs, getDocsByEmail } = require('../modules/documents');
const DocType = require('./docs');
// const UserType = require('./user');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            resolve: async function () {
                return await getAllDocs();
            }
        },
        docsbyemail: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            args: {
                email: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                const docs = await getDocsByEmail(args.email);

                return docs;
            }
        }
    })
});

module.exports = RootQueryType;
