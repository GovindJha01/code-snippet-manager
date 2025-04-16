import User from "../models/user-model.js";
import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ msg: "No token in auth !" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res
        .status(400)
        .json({ msg: "Error while decoding token in auth !" });
    }

    const user = await User.findById(decodedToken.token).populate("snippets");
    if (!user) {
      return res.status(400).json({ msg: "No user found !" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ msg: "Error in auth !", err: err.message });
  }
};

export default auth;