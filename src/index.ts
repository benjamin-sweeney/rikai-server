import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext } from "./types";
import { CharacterResolver } from "./resolvers/character";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  await createConnection();
  // await conn.runMigrations();

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CharacterResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
    }),
  });

  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
