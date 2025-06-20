import Base from "../models/base.models.js";

export const getAllBase = async (req, res) => {
  try {
    const bases = await Base.find();
    res.status(200).json(bases);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch bases", error: error.message });
  }
};
export const getBaseById = async (req, res) => {
  try {
    const base = await Base.fing(req.params.id);
    if (!base) {
      return res.status(404).json({ message: "Base not found" });
    }
    res.status(200).json(base);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch base", error: error.message });
  }
};
export const createBase = async (req, res) => {
  try {
    const userRole = req.user?.role;
    console.log(userRole)

    if (userRole !== "admin" && userRole !== "baseCommander") {
      return res
        .status(403)
        .json({ message: "Only admin or baseCommander can create a base" });
    }
    const base = new Base(req.body);
    await base.save();
    res.status(201).json(base);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create base", error: error.message });
  }
};
export const updateBase = async (req, res) => {
  try {
    const base = await Base.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!base) {
      return res.status(404).json({ message: "Base not found" });
    }
    res.status(200).json(base);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update base", error: error.message });
  }
};
export const deleteBase = async (req, res) => {
  try {
    const base = await Base.findByIdAndDelete(req.params.id);
    if (!base) {
      return res.status(404).json({ message: "Base not found" });
    }
    res.status(200).json({ message: "Base deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete base", error: error.message });
  }
};
