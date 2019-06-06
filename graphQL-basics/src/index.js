import { GraphQLServer } from "graphql-yoga";
import uuid from "uuid/v4";

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

const comments = [
  {
    id: "001",
    text: "Good tutorial, learn a lot from it",
    author: "1",
    post: "123"
  },
  {
    id: "002",
    text: "Really good",
    author: "2",
    post: "123"
  },
  {
    id: "003",
    text: "Super cool",
    author: "3",
    post: "456"
  },
  {
    id: "004",
    text: "Thanks for the author",
    author: "3",
    post: "789"
  }
];

const typeDefs = `
    type Query {
        users(query:String): [User!]!
        posts(query:String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type Mutation {
      createUser(name: String!, email: String!, age:Int): User!
      createPost(title: String!, body: String!, published: Boolean, author: ID!): Post!
      createComment(text: String! author: ID!, post: ID!): Comment!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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

    comments() {
      return comments;
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

  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => user.email === args.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }
      const user = {
        id: uuid(),
        name: args.name,
        email: args.email,
        age: args.age
      };
      users.push(user);
      return user;
    },

    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);
      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: uuid(),
        title: args.title,
        body: args.body,
        published: args.published,
        author: args.author
      };
      posts.push(post);
      return post;
    },

    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.author);
      const postExists = posts.some(post => {
        return post.id === args.post && post.published;
      });
      if (!userExists) {
        throw new Error("User not found");
      }
      if (!postExists) {
        throw new Error("Post not found");
      }

      const comment = {
        id: uuid(),
        text: args.text,
        author: args.author,
        post: args.post
      };

      comments.push(comment);
      return comment;
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
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
