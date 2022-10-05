const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLFloat,
    GraphQLNonNull
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
            type: DocType,
            description: 'List of all docs',
            args: {
                email: { type: GraphQLString }
            },
            resolve: async function (parent, arg) {
                return await getDocsByEmail(arg.email);
            }
        }
    })
});

module.exports = RootQueryType;
