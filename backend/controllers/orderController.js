import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Address from "../models/Address.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id; // JWT middleware se

    // 1️⃣ User address fetch
    const address = await Address.findOne({ user: userId });
    if (!address) return res.status(400).json({ message: "No address found" });

    // 2️⃣ User cart fetch
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // 3️⃣ Prepare order items
    const orderItems = cart.items.map((item) => {
      const product = item.product;
      return {
        product: product._id,
        name: product.title,
        quantity: item.quantity,
        price: product.price,
        image: product.image || "/placeholder.png",
      };
    });

    // 4️⃣ Calculate prices
    const itemsPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalPrice = itemsPrice; // agar shipping ya tax add karna ho, yahan add karo

    // 5️⃣ Create order
    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress: {
        street: address.street,
        city: address.city,
        district: address.district,
        currentAddress: address.currentAddress,
      },
      paymentMethod: req.body.paymentMethod || "COD",
      itemsPrice,
      totalPrice,
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await Order.find({ user: userId }).populate("orderItems.product");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
