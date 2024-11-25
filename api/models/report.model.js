import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" }, // Trạng thái báo cáo
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
