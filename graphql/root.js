const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLBoolean,
    // GraphQLFloat,
    // GraphQLNonNull
} = require('graphql');
const { getAllDocs, getDocsByEmail } = require('../modules/documents');
const { commentsByDocId, commentCreate, commentDelete } = require('../modules/comments');
const DocType = require('./docs');
const CommentType = require('./comment');
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
        },
        commentsByDocId: {
            type: new GraphQLList(CommentType),
            description: "comments for a document",
            args: {
                documentId: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                const comments = await commentsByDocId(args.documentId);

                return comments;
            }
        },
        commentCreate: {
            type: GraphQLString,
            description: "comments for a document",
            args: {
                documentId: { type: GraphQLString },
                email: { type: GraphQLString },
                text: { type: GraphQLString },
                startpos: { type: GraphQLInt },
                endpos: { type: GraphQLInt }
            },
            resolve: async function (parent, args) {
                const resultSet = await commentCreate(args.documentId, args.email, args.text, args.startpos, args.endpos);

                return resultSet.id;
            }
        },
        commentDelete: {
            type: GraphQLBoolean,
            description: "comments for a document",
            args: {
                commentId: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                const resultSet = await commentDelete(args.commentId);

                return resultSet.acknowledged;
            }
        }
    })
});

module.exports = RootQueryType;
