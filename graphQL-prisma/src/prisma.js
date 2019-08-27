import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466",
  secret: "thisismysupersecret"
});

export { prisma as default };

// prisma.query.users(null, "{id name email posts {id title}}").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.comments(null, "{id text author {id name}}").then(data => {
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "new post",
//         body: "Another raining winter night",
//         published: true,
//         author: {
//           connect: {
//             id: "cjywwftl900id0847mnjdlbwg"
//           }
//         }
//       }
//     },
//     "{id title body published}"
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.users(null, "{id name posts {id title}}");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// prisma.mutation
//   .updatePost(
//     {
//       data: {
//         title: "new post updated",
//         body: "Another raining winter night",
//         published: false
//       },
//       where: {
//         id: "cjz5hrknr006l08471fdup23u"
//       }
//     },
//     "{id title body published}"
//   )
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//     return prisma.query.posts(null, "{id title body published}");
//   })
//   .then(data => {
//     console.log(JSON.stringify(data, undefined, 2));
//   });

// const createPostForUser = async (authorId, data) => {
//   const userExist = await prisma.exists.User({ id: authorId });
//   if (!userExist) {
//     throw new Error("User not found");
//   }
//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{author {id name email posts {id title body published}}}"
//   );
//   return post.author;
// };

// createPostForUser("cjywwftl900id0847mnjdlbwg", {
//   title: "Zoey",
//   body: "Zoey is a good girl",
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(error => {
//     console.log(error.message);
//   });

// const updatePostForUser = async (postId, data) => {
//   const postExist = await prisma.exists.Post({ id: postId });
//   if (!postExist) {
//     throw new Error("Post not found");
//   }
//   const post = await prisma.mutation.updatePost(
//     {
//       data,
//       where: {
//         id: postId
//       }
//     },
//     "{author {id name email posts {id title body published}}}"
//   );

//   return post.author;
// };

// updatePostForUser("cjz6cb8vc00yr084749lmqgyb", {
//   title: "Zoey",
//   body: "Zoey is a good and nice and smart girl",
//   published: true
// })
//   .then(user => {
//     console.log(JSON.stringify(user, undefined, 2));
//   })
//   .catch(error => {
//     console.log(error);
//   });
