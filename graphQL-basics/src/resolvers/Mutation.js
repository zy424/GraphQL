import uuid from "uuid/v4";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some(user => user.email === args.data.email);
    if (emailTaken) {
      throw new Error("Email taken");
    }
    const user = {
      id: uuid(),
      ...args.data
    };
    db.users.push(user);
    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = users.findIndex(user => user.id === args.id);
    if (userIndex === -1) {
      throw new Error("User not found");
    }

    const deleteUsers = db.users.splice(userIndex, 1);
    db.posts = db.posts.filter(post => {
      const match = post.author === args.id;
      if (match) {
        db.comments = db.comments.filter(comment => comment.post !== post);
      }
      return !match;
    });
    db.comments = db.comments.filter(comment => comment.author !== args.id);
    return deleteUsers[0];
  },

  createPost(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuid(),
      ...args.data
    };
    db.posts.push(post);
    return post;
  },

  deletePost(parent, args, { db }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    db.comments = db.comments.filter(comment => comment.post !== args.id);
    const deletePosts = db.posts.splice(postIndex, 1);
    return deletePosts[0];
  },

  createComment(parent, args, { db }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(post => {
      return post.id === args.data.post && post.published;
    });
    if (!userExists) {
      throw new Error("User not found");
    }
    if (!postExists) {
      throw new Error("Post not found");
    }

    const comment = {
      id: uuid(),
      ...args.data
    };

    db.comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const deleteComments = db.comments.splice(commentIndex, 1);
    return deleteComments[0];
  }
};

export { Mutation as default };
