export default {
    notes: async (parent: any, args: any, { models }: any) => {
        return await models.Note.find().limit(100);
    },
    note: async (parent: any, args: { id: string; }, { models }: any) => {
        return await models.Note.findById(args.id);
    },
    user: async (parent: any, args: { username: string; }, { models }: any) => {
        return await models.User.findOne({ username: args.username });
    },
    users: async (parent: any, args: any, { models }: any) => {
        return await models.User.find({});
    },
    me: async (parent: any, args: any, { models, user }: any) => {
        return await models.User.findById(user.id);
    },
    noteFeed: async (parent: any, { cursor }: { cursor: string }, { models }: any) => {
        // hard code the limit to 10 items
        const limit = 10;
        // set the default hasNextPage value to false
        let hasNextPage = false;
        // if no cursor is passed the default query will be empty
        // this will pull the newest notes from the db
        let cursorQuery = {};
    
        // if there is a cursor
        // our query will look for notes with an ObjectId less than that of the cursor
        if (cursor) {
          cursorQuery = { _id: { $lt: cursor } };
        }
    
        // find the limit + 1 of notes in our db, sorted newest to oldest
        let notes = await models.Note.find(cursorQuery)
          .sort({ _id: -1 })
          .limit(limit + 1);
    
        // if the number of notes we find exceeds our limit
        // set hasNextPage to true & trim the notes to the limit
        if (notes.length > limit) {
          hasNextPage = true;
          notes = notes.slice(0, -1);
        }
    
        // the new cursor will be the Mongo ObjectID of the last item in the feed array
        const newCursor = notes[notes.length - 1]._id;
    
        return {
          notes,
          cursor: newCursor,
          hasNextPage
        };
    }
}