const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Ingredient = require("../models/Ingredient");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//helper function to get cart by userId or guestId . hàm trợ giúp để lấy giỏ hàng theo userId hoặc guestId
const getCart = async (userId, guestId) => {
  if (userId) {
    // If user is logged in, find cart by user ID
    return await Cart.findOne({ user: userId });
  } else if (guestId) {
    // If guest, find cart by guest ID
    return await Cart.findOne({ guestId });
  } else {
    // If neither, return null
    return null;
  }
};

// Helper function to find product or ingredient
const findProductOrIngredient = async (productId) => {
  // Try to find as a product first
  let item = await Product.findById(productId);
  let itemType = 'Product';
  
  // If not found as product, try as ingredient
  if (!item) {
    item = await Ingredient.findById(productId);
    itemType = 'Ingredient';
  }
  
  return { item, itemType };
};

// Helper function to calculate price based on size
const calculatePriceBySize = (product, size) => {
  // Nguyên liệu không có size pricing, chỉ có giá cố định
  if (!product.sizePricing) {
    return product.discountPrice || product.price;
  }
  
  // Nếu có sizePricing và size được chọn (chỉ cho sản phẩm)
  if (product.sizePricing && product.sizePricing.length > 0 && size) {
    const sizePrice = product.sizePricing.find(sp => sp.size === size);
    if (sizePrice) {
      // Ưu tiên discountPrice nếu có, không thì lấy price
      return sizePrice.discountPrice || sizePrice.price;
    }
  }
  
  // Fallback về giá gốc - ưu tiên discountPrice
  return product.discountPrice || product.price;
};

// @route POST /api/cart
// @desc Add product to cart for a guest or logged-in user  .  Thêm sản phẩm vào giỏ hàng cho khách hoặc người dùng đã đăng nhập
// @access Public

router.post("/", async (req, res) => {
  const { productId, quantity, size, flavor, guestId, userId } = req.body;

  try {
    const { item, itemType } = await findProductOrIngredient(productId);
    
    if (!item) {
      return res.status(404).json({ message: "Sản phẩm hoặc nguyên liệu không tìm thấy" });
    }

    // Tính giá theo size đã chọn (chỉ áp dụng cho sản phẩm)
    const priceBySize = calculatePriceBySize(item, size);

    //determine if the user is logged in or a guest
    let cart = await getCart(userId, guestId);

    //if the cart exists, update it
    if (cart) {
      const productIndex = cart.products.findIndex(
        (e) =>
          e.productId.toString() === productId.toString() &&
          e.size === size &&
          e.flavor === flavor
      );

      if (productIndex > -1) {
        // If product already exists in cart, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // If product does not exist, add it to cart
        cart.products.push({
          productId: item._id,
          name: item.name,
          image: (item.images && item.images.length > 0) ? 
                 (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url) : "",
          price: priceBySize, // Sử dụng giá đã tính theo size
          quantity,
          size: size || "Mặc định",
          flavor: flavor || "Mặc định",
          itemType, // Thêm thông tin loại item
        });
      }
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      const newCart = await Cart.create({
        user: userId ? userId : undefined,
        guestId: guestId ? guestId : "guest_" + new Date().getTime(), // Generate a unique guest ID
        products: [
          {
            productId,
            name: item.name,
            image: (item.images && item.images.length > 0) ? 
                   (typeof item.images[0] === 'string' ? item.images[0] : item.images[0]?.url) : "",
            price: priceBySize, // Sử dụng giá đã tính theo size
            quantity,
            size: size || "Mặc định",
            flavor: flavor || "Mặc định",
            itemType, // Thêm thông tin loại item
          },
        ],
        totalPrice: priceBySize * quantity, // Sử dụng giá đã tính theo size
      });
      return res.status(201).json(newCart);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route PUT /api/cart
//@desc update product quantity in cart for a logged-in user or guest
// @access Private
router.put("/", async (req, res) => {
  const { productId, quantity, size, flavor, guestId, userId } = req.body;

  try {
    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (e) =>
        e.productId.toString() === productId &&
        e.size === size &&
        e.flavor === flavor
    );

    if (productIndex > -1) {
      if (quantity > 0) {
        // If product exists in cart, update quantity
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); // Remove product if quantity is 0
      }
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error updating product quantity:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route DELETE /api/cart
//@desc Remove a product from cart
//@access public
router.delete("/", async (req, res) => {
  const { productId, size, flavor, guestId, userId } = req.body;
  try {
    const cart = await getCart(userId, guestId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (e) =>
        e.productId.toString() === productId &&
        e.size === size &&
        e.flavor === flavor
    );

    if (productIndex > -1) {
      cart.products.splice(productIndex, 1); // Remove product from cart
      // Recalculate total price
      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//@route GET /api/cart
//@desc Get logged-in user's or guest's cart
//@access Public

router.get("/", protect, async (req, res) => {
  const { userId, guestId } = req.query;
  try {
    const cart = await getCart(userId, guestId);
    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route POST /api/cart/merge
// @desc Merge guest cart into user cart on login
// @access Private
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;
  try {
    //Find the guest cart and user's cart
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });
    
    if (guestCart) {
      if (guestCart.products.length === 0) {
        return res.status(404).json({ message: "Guest cart is empty" });
      }
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const productIndex = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.flavor === guestItem.flavor
          );
          if (productIndex > -1) {
            // If product already exists in user's cart, update quantity
            userCart.products[productIndex].quantity += guestItem.quantity;
          } else {
            // If product does not exist, add it to user's cart
            userCart.products.push(guestItem);
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        await userCart.save();
        //remove the guest cart after merging
        try {
            await Cart.findOneAndDelete({ guestId });
        } catch (error) {
            console.log("Error deleting guest cart:", error);
        }
        res.status(200).json(userCart);
      }else {
        //if the user has no existing cart, just assign the guest cart to the user
        guestCart.user = req.user._id; // Assign user ID to the cart
        guestCart.guestId = undefined; // Remove guest ID
        await guestCart.save();

        res.status(200).json(guestCart);
      } 
    }else{
        if (userCart) {
            // If user already has a cart, just return it
            return res.status(200).json(userCart);
        }
        res.status(404).json({ message: "No guest cart found to merge" });
    }
  } catch (error) {
    console.error("Error merging carts:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
