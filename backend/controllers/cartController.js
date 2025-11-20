import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    // check if product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    // populate product details for frontend
    const populatedCart = await cart.populate("items.product");

    res.status(200).json({
      message: "Product added to cart successfully",
      cart: populatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(200).json({ message: "Cart empty", cart: null });

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart items", error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: productId } = req.params;

    // Find user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find index of product in items array
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Remove item from array
    cart.items.splice(itemIndex, 1);

    // Save updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error removing item",
      error: error.message,
    });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await Cart.deleteMany({ user: userId });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
// controllers/cartController.js (or wherever)


export const increaseQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params; // could be productId or cartItemId

    // find user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for this user" });
    }

    // find item either by cart item _id or by product id
    const item = cart.items.find(
      (it) =>
        (it._id && it._id.toString() === id) ||
        (it.product && it.product.toString() === id)
    );

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = (item.quantity || 0) + 1;

    await cart.save();

    // populate product details before returning (optional but recommended)
    const populatedCart = await cart.populate("items.product");

    return res.status(200).json({
      message: "Quantity increased",
      cart: populatedCart,
      itemUpdatedId: item._id,
    });
  } catch (error) {
    console.error("increaseQuantity error:", error);
    return res.status(500).json({ message: "Error increasing quantity", error: error.message });
  }
};

export const decreaseQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: productId } = req.params; // productId from URL

    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find product inside cart.items array
    const itemIndex = cart.items.findIndex(
      (item) => item.product._id.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    // Get item
    const cartItem = cart.items[itemIndex];

    // If quantity > 1 → decrease
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
    } else {
      // Quantity = 1 → remove item from cart array
      cart.items.splice(itemIndex, 1);
    }

    // Save cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      cart,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error decreasing quantity",
      error: error.message,
    });
  }
};
