import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: [true, "title required"],
    },

    description: {
      type: String,
      require: [true, "description required"],
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    startAt: {
      type: String,
      required: true,
    },
    endAt: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      default: "low",
    },
  },
  { timestamps: true }
);

export const Tasks = mongoose.model("Tasks", taskSchema);
