import { Response, Request } from "express";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { PasswordValidator } from "password-validator-pro";
import { signToken } from "../utils/signToken.utils";
import { passwordErrorFormatter } from "../utils/passwordErrorFormatter.utils";
import { deleteTrackFromS3 } from "../utils/s3Utils";

export const register = async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    //check if the user is already registered
    const isRegistered = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (isRegistered) {
      return res.status(409).json({
        success: false,
        message: "user with this email is already registered",
      });
    }

    //creating salt for token
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        passHash: hash,
        email: email,
      },
    });

    //signing token with user id and secret key for
    const token = signToken(newUser);

    res.status(200).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    console.log("Registration error", error);

    res.status(500).json({
      message: "Registration error",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const isValidPass = await bcrypt.compare(password, existingUser.passHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken(existingUser);

    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log("Login error", error);

    res.status(500).json({
      message: "Login error",
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
    const { password, email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(403).json({
        message: "user not found",
      });
    }

    const passValidator = new PasswordValidator({
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireSpecialChars: true,
    });

    //checking password strength
    const passCheckResult = passValidator.validate(password);

    if (!passCheckResult.valid) {
      return res.status(400).json({
        message: passwordErrorFormatter(passCheckResult.errors),
      });
    }

    //creating salt for token
    const salt = await bcrypt.genSalt();
    const hash: string = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: { passHash: hash },
    });

    res.status(200).json({ message: "password updated" });
  } catch (error) {
    console.log("Password update error", error);

    res.status(500).json({ message: "Password update error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    const allTracks = await prisma.track.findMany({
      where: {
        uploaderId: userId,
      },
    });

    for (const track of allTracks) {
      await deleteTrackFromS3(track.fileKey);
    }

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.log("error deleting user", error);

    res.status(500).json({ message: "User delete error" });
  }
};
