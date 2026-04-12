import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { User } from "./auth.model.js";
import { env } from "../../config/env.js";

const googleClient = new OAuth2Client();

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const createToken = (userId) => jwt.sign({ userId }, env.jwtSecret, { expiresIn: "7d" });

const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "customer",
    });

    const token = createToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Account created successfully.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const logout = (_req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    sameSite: "lax",
  });

  return res.status(200).json({ message: "Logged out successfully." });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.userId).select("_id name email role");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized." });
    }

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized." });
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!env.googleClientId) {
      return res.status(500).json({ message: "Google sign-in is not configured on server." });
    }

    if (!idToken) {
      return res.status(400).json({ message: "Google token is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.googleClientId,
    });

    const payload = ticket.getPayload();
    const email = payload?.email?.toLowerCase();
    const name = payload?.name;

    if (!email || !name) {
      return res.status(400).json({ message: "Invalid Google account payload." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      const generatedPassword = await bcrypt.hash(`${email}_${Date.now()}`, 10);
      user = await User.create({
        name,
        email,
        password: generatedPassword,
        role: "customer",
      });
    }

    const token = createToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Google login successful.",
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const ensureDefaultAdminUser = async () => {
  const adminEmail = env.adminEmail.toLowerCase();
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (existingAdmin) {
    if (existingAdmin.role !== "admin") {
      existingAdmin.role = "admin";
      await existingAdmin.save();
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(env.adminPassword, 10);

  await User.create({
    name: env.adminName,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });
};
