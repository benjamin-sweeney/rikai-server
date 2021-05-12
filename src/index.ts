import "reflect-metadata";
import { createConnection } from "typeorm";
// import { Character } from "./entities/Character";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext } from "./types";
import { HelloResolver } from "./resolvers/hello";

const main = async () => {
  // const conn = await createConnection();

  // create a character
  // const char = conn.manager.create(Character, { romaji: "あ" });
  // await conn.manager.save(char);

  // list all characters
  // const chars = await conn.manager.find(Character);
  // console.log("chars: ", chars);

  const app = express();

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver],
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
