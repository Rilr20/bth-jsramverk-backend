const {
    GraphQLObjectType,
    GraphQLString,
    // GraphQLList,
    // GraphQLFloat,
    GraphQLNonNull,
    // GraphQLBoolean,
    GraphQLInt
} = require('graphql');

//make comment
//needs document id, email, comment text, date time, start row and end row position,
//skicka till databasen.
const CommentType = new GraphQLObjectType({
    name: "comment",
    description: 'respressents a comment',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        documentId: { type: GraphQLString },
        email: { type: GraphQLString },
        text: { type: GraphQLString },
        date: { type: GraphQLString },
        startpos: { type: GraphQLInt },
        endpos: { type: GraphQLInt },
    })
});


module.exports = CommentType;
