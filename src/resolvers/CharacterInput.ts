import { InputType, Field } from "type-graphql";

@InputType()
export class CharacterInput {
  @Field()
  romaji: string;
  @Field()
  text: string;
  @Field()
  type: string;
}
