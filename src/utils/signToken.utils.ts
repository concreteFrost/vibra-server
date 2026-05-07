import { User } from "../generated/prisma/client";
import jwt from "jsonwebtoken";

export function signToken(user: User): string {
  return jwt.sign({ id: user.id, email: user.email }, process.env.SECRET_KEY!, {
    expiresIn: "365d",
  });
}
