const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

//@route POST /api/users/register
//@desc Register a new user
//@access Public
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
    });
    await user.save();

    //create jwt payload

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    //sign and return the token

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error(" Error", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route POST /api/users/login
// @desc Mô tả quyền xác nhập truy cập
//@access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    //kiểm tra người dùng có tồn tại hay không
    if (!user)
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ!" });
    const isMatch = await user.matchPassword(password);
    //kiểm tra mật khẩu
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Thông tin đăng nhập không hợp lệ!" });

    //sign and return the token
    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            phone: user.phone,
            address: user.address,
            createdAt: user.createdAt
          },
          token,
        });
      }
    );
  } catch (err) {
    console.log(error);
    res.status(500).json({ message: "Server error!" });
  }
});

// @route GET /api/users/profile
//@desc Lấy hồ sơ người dùng đã đăng nhập
//@access Private

router.get("/profile",protect, async (req, res) => {
    res.json(req.user);
});

// @route PUT /api/users/profile
//@desc Cập nhật hồ sơ người dùng
//@access Private

router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phone, address, avatar } = req.body;
    
    // Tìm user hiện tại
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra email có bị trùng không (nếu thay đổi email)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email này đã được sử dụng" });
      }
    }

    // Cập nhật thông tin
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Lỗi server khi cập nhật thông tin" });
  }
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route POST /api/users/upload-avatar
//@desc Upload user avatar
//@access Private

router.post("/upload-avatar", protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng chọn file ảnh" });
    }

    // Convert buffer to base64
    const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    
    // Upload to cloudinary
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: "ml_default",
      folder: "luna_bakery/avatars",
      transformation: [
        { width: 200, height: 200, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" }
      ]
    });

    // Update user avatar
    const user = await User.findById(req.user._id);
    user.avatar = uploadResponse.secure_url;
    await user.save();

    res.json({
      message: "Avatar uploaded successfully",
      avatar: uploadResponse.secure_url
    });

  } catch (error) {
    console.error("Upload avatar error:", error);
    res.status(500).json({ message: "Lỗi server khi upload ảnh đại diện" });
  }
});

module.exports = router;
