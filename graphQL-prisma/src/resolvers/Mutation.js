import uuidv4 from "uuid/v4";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Take in password -> Validate password -> Hash password -> Generate auth token
// JSON Web Token(JWT)

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer");
    }
    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: password
      }
    });
    return {
      user,
      token: jwt.sign({ userId: user.id }, "This is a token")
    };
  },

  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("User not found");
    }
    return await prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },

  async updateUser(parent, args, { prisma }, info) {
    return await prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    });
  },

  async createPost(parent, args, { prisma }, info) {
    return await prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: args.data.author
            }
          }
        }
      },
      info
    );
  },

  async deletePost(parent, args, { prisma }, info) {
    return await prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },

  async updatePost(parent, args, { prisma }, info) {
    return await prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  },

  async createComment(parent, args, { prisma }, info) {
    return await prisma.mutation.createComment(
      {
        data: {
          text: args.data.text,
          author: {
            connect: {
              id: args.data.author
            }
          },
          post: {
            connect: {
              id: args.data.post
            }
          }
        }
      },
      info
    );
  },
  async deleteComment(parent, args, { prisma }, info) {
    return await prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
  },
  async updateComment(parent, args, { prisma }, info) {
    return await prisma.mutation.updateComment(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
  }
};

export { Mutation as default };
