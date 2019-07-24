import uuid from "uuid/v4";
import { PubSub } from "graphql-yoga";

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
    const userIndex = db.users.findIndex(user => user.id === args.id);
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

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => user.email === data.email);
      if (emailTaken) {
        throw new Error("Email taken");
      }
      user.email = data.email;
    }
    if (typeof data.name === "string") {
      user.name = data.name;
    }
    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);
    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: uuid(),
      ...args.data
    };
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }

    db.posts.push(post);

    return post;
  },

  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex(post => post.id === args.id);
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    db.comments = db.comments.filter(comment => comment.post !== args.id);
    const [deletePost] = db.posts.splice(postIndex, 1);
    if (deletePost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: deletePost
        }
      });
    }
    return deletePost;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };
    if (!post) {
      throw new Error("Page not found");
    }
    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;
      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      // updated
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
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
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const comment = db.comments.find(comment => comment.id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (typeof comment.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment
      }
    });

    return comment;
  },

  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [deleteComment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deleteComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deleteComment
      }
    });
    return deleteComment;
  }
};

export { Mutation as default };
