import "reflect-metadata";
import { createConnection } from "typeorm";
import { Character } from "./entities/Character";

const main = async () => {
  const conn = await createConnection();
  // const char = conn.manager.create(Character, { romaji: "あ" });
  // await conn.manager.save(char);
  const chars = await conn.manager.find(Character);
  console.log("chars: ", chars);
};

main().catch((err) => {
  console.log(err);
});
