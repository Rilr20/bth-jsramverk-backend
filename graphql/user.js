const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLFloat,
    // GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

const UserType = new GraphQLObjectType({
    name: "user",
    description: 'respressents document',
    fields: () => ({
        _id: {type: GraphQLString()},
        email: {type: GraphQLString()},
        password: {type: GraphQLString()},
        docs: { type: GraphQLList(DocType)},
    })
});
const DocType = new GraphQLObjectType({
    name: "access",
    description: "represents users that has access to document",
    fields: () => ({
        id: { type: GraphQLString },
        write: { type: GraphQLBoolean }
    })
});

module.exports = UserType;
