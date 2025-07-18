import User from "../models/user-model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const handleSignup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res
        .status(400)
        .json({ msg: "userName , email and password are required !" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ msg: "User is already registerd ! Please Login ." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(400).json({ msg: "Error in password hashing !" });
    }

    const user = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const result = await user.save();
    if (!result) {
      return res.status(400).json({ msg: "Error while saving user !" });
    }

    const accesToken = jwt.sign({ token: result._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    if (!accesToken) {
      return res.status(400).json({ msg: "Error while generating token !" });
    }
    res.cookie("token", accesToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res.status(201).json({
      msg: `User Signed in successfully ! hello ${result?.userName}`,
      user: {
        _id: result._id,
        userName: result.userName,
        email: result.email,
        createdAt: result.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: "Error in signup !", err: err.message });
  }
};

export const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and Password are required !" });
    }
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ msg: "Please Signin first !" });
    }

    const passwordMatched = await bcrypt.compare(password, userExists.password);
    if (!passwordMatched) {
      return res.status(400).json({ msg: "Incorrect credentials !" });
    }

    const accessToken = jwt.sign(
      { token: userExists._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    if (!accessToken) {
      return res.status(400).json({ msg: "Token not gemnerated in login !" });
    }

    res.cookie("token", accessToken, {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: "none",
      partitioned: true,
    });

    res.status(200).json({
      msg: "User logged in succcessfully !",
      user: {
        _id: userExists._id,
        userName: userExists.userName,
        email: userExists.email,
        createdAt: userExists.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: "Error in login !", err: err.message });
  }
};

export const handleLogout = (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    res.status(200).json({ msg: "User logged out successfully !" });
  } catch (err) {
    res.status(400).json({ msg: "Error in logout !", err: err.message });
  }
};

export const fetchUser = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const handleUpdateUser = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    const { userName, email } = req.body;

    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }

    if (!userName || !email) {
      return res
        .status(400)
        .json({ msg: "Both fields are required to update!" });
    }

    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists && emailExists._id.toString() !== user._id.toString()) {
        return res.status(400).json({ msg: "Email is already in use!" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { userName, email },
      { new: true }
    );

    res.status(200).json({
      msg: "User updated successfully!",
      user: {
        _id: updatedUser._id,
        userName: updatedUser.userName,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (err) {
    res.status(400).json({ msg: "Error in updating user!", err: err.message });
  }
};


