import jwt from "jsonwebtoken";
import { ENV_VARS } from "../config/envVars.js";

export const generateTokenAndSetCookie = (userId, res) => {
  
  const token = jwt.sign({ userId }, ENV_VARS.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt-aurastream", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: ENV_VARS.NODE_ENV !== "development",
  });
  return token;
};

export const generateTokenAndSetCookieOnProfileSelection = (userId, profileId, res) => {
  const token = jwt.sign({ userId: userId.toString(), profileId:profileId.toString() }, ENV_VARS.JWT_SECRET, { expiresIn: "10d" });
  console.log(token);

  res.cookie("jwt-aurastream", token, { //use the same cookie name.
      maxAge: 10 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: ENV_VARS.NODE_ENV !== "development",
  });
  return token;
};