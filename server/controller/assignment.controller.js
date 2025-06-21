import Assignment from "../models/assignment.js";
import Asset from "../models/asset.js";

export const getAssignmnet = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("assetId")
      .populate("baseId");

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignments", error: error.message });
  }
};

export const getAssignmnetById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate("assetId")
      .populate("baseId");

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch assignment", error: error.message });
  }
};

export const createAssignment = async (req, res) => {
  try {
    const { assetId, personnelName, quantity, baseId } = req.body;

    if (!assetId || !personnelName || !quantity || !baseId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }
    if (asset.closingBalance < quantity) {
      return res.status(400).json({ message: "Insufficient asset quantity" });
    }

    asset.closingBalance -= quantity;
    asset.netMovement -= quantity;
    await asset.save();

    const newAssignment = new Assignment({
      assetId,
      personnelName,
      quantity,
      baseId
    });

    const saved = await newAssignment.save();
    res.status(201).json({ message: "Assignment created successfully", data: saved });
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error: error.message });
  }
};

export const updateAssignment = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment updated successfully", data: updated });
  } catch (error) {
    res.status(400).json({ message: "Failed to update assignment", error: error.message });
  }
};

export const deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete assignment", error: error.message });
  }
};
