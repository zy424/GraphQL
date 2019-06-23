const users = [
  {
    id: "1",
    name: "Jamie",
    email: "123.com"
  },
  {
    id: "2",
    name: "Andrew",
    email: "456.com",
    age: 27
  },
  {
    id: "3",
    name: "Katie",
    email: "789.com",
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
    published: true,
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

const db = {
  users,
  posts,
  comments
};

export { db as default };
