const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    // GraphQLFloat,
    GraphQLNonNull,
    GraphQLBoolean
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: "doc",
    description: 'respressents document',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        text: { type: GraphQLString },
        code: { type: GraphQLBoolean },
        access: { type: GraphQLList(AccessType) }
    })
});

const AccessType = new GraphQLObjectType({
    name: "access",
    description: "represents users that has access to document",
    fields: () => ({
        user: { type: GraphQLString },
        write: { type: GraphQLBoolean }
    })
});


module.exports = DocType;
