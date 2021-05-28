import { Character } from "../entities/Character";
import { Arg, Int, Mutation, Query, Resolver } from "type-graphql";
import { getConnection } from "typeorm";
import { CharacterInput } from "./CharacterInput";

@Resolver(Character)
export class CharacterResolver {
  @Query(() => [Character])
  async characters(): Promise<Character[]> {
    const chars = await Character.find();
    return chars;
  }

  @Query(() => Character, { nullable: true })
  character(@Arg("id", () => Int) id: number): Promise<Character | undefined> {
    return Character.findOne(id);
  }

  @Mutation(() => Character)
  async createCharacter(
    @Arg("input") input: CharacterInput
  ): Promise<Character> {
    return Character.create({ ...input }).save();
  }

  @Mutation(() => Boolean)
  async deleteCharacter(@Arg("id", () => Int) id: number): Promise<boolean> {
    await Character.delete(id);
    return true;
  }

  @Mutation(() => Character, { nullable: true })
  async updateCharacter(
    @Arg("id", () => Int) id: number,
    @Arg("input") input: CharacterInput
  ): Promise<Character | null> {
    // note: could not use the native typeorm "update" method without making extra sql queries
    // todo: handle null values
    const result = await getConnection()
      .createQueryBuilder()
      .update(Character)
      .set({ ...input })
      .where("id = :id", { id })
      .returning("*")
      .execute();

    return result.raw[0];
  }
}
