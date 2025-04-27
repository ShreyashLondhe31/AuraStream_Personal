// utils/generateTokenAndSetCookie.js
import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (payload, res, expiresIn = "15d") => {
  const token = jwt.sign(payload, ENV_VARS.JWT_SECRET, { expiresIn });

  res.cookie("jwt-aurastream", token, {
    maxAge: parseExpirationStringToMilliseconds(expiresIn),
    httpOnly: true,
    sameSite: "strict",
    secure: ENV_VARS.NODE_ENV !== "development",
    path: '/', // Ensure the cookie is available across your application
  });
  return token;
};

// Helper function to convert expiration string (e.g., "15d") to milliseconds
const parseExpirationStringToMilliseconds = (expiresIn) => {
  const value = parseInt(expiresIn);
  const unit = expiresIn.replace(value.toString(), '').toLowerCase();
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return 15 * 24 * 60 * 60 * 1000; // Default to 15 days
  }
};