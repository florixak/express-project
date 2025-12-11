import jwt from "jsonwebtoken";
import { getPrisma } from "../config/db.js";
import { Request, Response, NextFunction } from "express";

// Read the token from the request
// Verify the token
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt as string;
  }
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    const user = await getPrisma().user.findUnique({
      where: { id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    (req as any).user = user;

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default authMiddleware;
