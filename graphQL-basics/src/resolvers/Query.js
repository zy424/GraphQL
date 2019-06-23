const Query = {
  users(parent, args, { db }, info) {
    console.log(db);
    if (!args.query) {
      return db.users;
    }
    return users.filter(user => {
      return user.name
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
    });
  },
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter(post => {
      const isTitleMatch = post.title
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
      const isBodyMatch = post.body
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
      return isTitleMatch || isBodyMatch;
    });
  },

  comments(parent, args, { db }, info) {
    return db.comments;
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
};

export { Query as default };
