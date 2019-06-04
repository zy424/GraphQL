import { GraphQLServer } from "graphql-yoga";

// Type definition(schema)

// Scalar types = String, Boolean, Int, Float, ID

//Demo user data
const users = [
  {
    id: "1",
    name: "Jamie",
    age: 34
  },
  {
    id: "2",
    name: "Andrew",
    age: 27
  },
  {
    id: "3",
    name: "Katie",
    age: 37
  }
];

const posts = [
  {
    id: "123",
    title: "Learn GraphQL",
    body: "GraphQL is super cool!",
    published: true,
    author: "1"
  },
  {
    id: "456",
    title: "Learn Apollo",
    body: "Apollo is super cool!",
    published: false,
    author: "2"
  },
  {
    id: "789",
    title: "Learn Angular",
    body: "angular is super cool!",
    published: true,
    author: "2"
  }
];

const typeDefs = `
    type Query {
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

// Resolvers()

const resolvers = {
  Query: {
    // passing data from the client over the server
    // greeting(parent, args, ctx, info) {
    //   if (args.name) {
    //     return `Hello, ${args.name}`;
    //   } else {
    //     return "Hello";
    //   }
    // },
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        const isTitleMatch = post.title
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        const isBodyMatch = post.body
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        return isTitleMatch || isBodyMatch;
      });
    },

    me() {
      return {
        id: "22222233",
        name: "Ben",
        email: "zhouyi.com",
        age: 23
      };
    },
    post() {
      return {
        id: "1344",
        title: "Today",
        body: "Today is a nice day!",
        published: true
      };
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers
});

server.start(() => {
  console.log("The server is up");
});
