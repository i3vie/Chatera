import { Request } from "express";
import jwt from "jsonwebtoken";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {

  if (securityName === "bearerAuth") {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded;
    } catch {
      throw new Error("Invalid token");
    }
  }

  throw new Error("Invalid security name");
}
