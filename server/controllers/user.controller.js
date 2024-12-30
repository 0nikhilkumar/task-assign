import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
      const {password, username} = req.body;
      console.log(password, username);
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        username: username,
        password: hashedPassword,
      });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
    }
  }


export const login = async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (user == null) {
      return res.status(400).json({ message: 'Cannot find user' });
    }
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.cookie('token', accessToken, { httpOnly: true, maxAge: 3600000, expiresIn: '1h'  });
        res.json({ token: accessToken, message: 'Logged in successfully' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }

  }

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
}

export const checkAuth = (req, res) => {
  res.json({ isAuthenticated: true });
};