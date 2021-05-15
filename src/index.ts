import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { MyContext } from "./types";
import { CharacterResolver } from "./resolvers/character";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import {
  COOKIE_NAME,
  CORS_ORIGIN,
  SESSION_SECRET,
  __prod__,
} from "./constants";
import cors from "cors";

const main = async () => {
  await createConnection();
  // await conn.runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redisClient = new Redis();
  app.set("with proxy", 1);
  app.use(
    cors({
      origin: CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
    })
  );

  const server = new ApolloServer({
    schema: await buildSchema({
      resolvers: [CharacterResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis: redisClient,
    }),
  });

  server.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("server started on localhost:4000");
  });
};

main().catch((err) => {
  console.log(err);
});
