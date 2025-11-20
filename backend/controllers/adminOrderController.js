import Order from "../models/orderModel.js";

// @desc    Get all orders (FOR ADMIN)
// @route   GET /api/adminorders/all
// @access  Private/Admin
const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort({ createdAt: -1 }) // Sabse naye order upar
      .populate("user", "id name email") // User ki details fetch karein
      
      // 👇 YEH SABSE ZAROORI BADLAV HAI 👇
      // Har order ke 'orderItems' ke andar 'product' ko Product model se populate karein
      .populate({
        path: "orderItems.product",      // Nested path
        select: "imageUrl name",         // Sirf imageUrl aur name laayein (efficiency ke liye)
      });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update order status (FOR ADMIN)
// @route   PUT /api/adminorders/status/:id
// @access  Private/Admin
const updateOrderStatusAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const { status } = req.body;
      
      if (!["Processing", "Shipped", "Delivered"].includes(status)) {
         return res.status(400).json({ message: "Invalid status value" });
      }

      order.status = status;

      if (status === "Delivered") {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get logged in user orders (FOR USER)
// @route   GET /api/orders/get
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })

            // 👇 YAHAN BHI WAHI ZAROORI BADLAV HAI 👇
            // Product ki poori details (khaas kar ke imageUrl) ko fetch karein
            .populate({
                path: 'orderItems.product', // orderItems array ke andar product field ko populate karo
                select: 'imageUrl name'      // Sirf imageUrl aur name laao
            });

        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

export { getAllOrdersAdmin, updateOrderStatusAdmin, getMyOrders };