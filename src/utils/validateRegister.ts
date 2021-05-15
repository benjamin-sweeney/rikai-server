import { User } from "../entities/User";
import { UsernamePasswordInput } from "src/resolvers/UsernamePasswordInput";

export const validateRegister = async (options: UsernamePasswordInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: "username",
        message: "username length must be more than two",
      },
    ];
  }
  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "password length must be more than two",
      },
    ];
  }
  const existingUser = await User.findOne({ username: options.username });
  if (existingUser) {
    return [
      {
        field: "username",
        message: "username already taken",
      },
    ];
  }
  return null;
};
