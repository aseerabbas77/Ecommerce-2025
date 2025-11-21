import Address from "../models/Address.js";

export const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { street, city, district, currentAddress } = req.body;

    const address = new Address({
      user: userId,
      street,
      city,
      district,
      currentAddress,
    });

    await address.save();

    res.status(201).json({ success: true, address });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    const addresses = await Address.find({ user: userId });
    res.status(200).json({ success: true, addresses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
