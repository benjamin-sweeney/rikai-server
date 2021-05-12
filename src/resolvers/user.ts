import argon2 from "argon2";
import { User } from "../entities/User";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { validateRegister } from "../utils/validateRegister";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput
  ): Promise<UserResponse> {
    const validationErrors = validateRegister(options);
    if (validationErrors) {
      return { errors: validationErrors };
    }

    const hashedPassword = await argon2.hash(options.password);
    const user = await User.create({
      username: options.username,
      password: hashedPassword,
    }).save();

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("userName") userName: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    // Check for user
    const user = await User.findOne({ username: userName });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username does not exist",
          },
        ],
      };
    }

    // Check for valid password
    const validPassword = await argon2.verify(user.password, password);
    if (!validPassword) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    return { user };
  }
}
