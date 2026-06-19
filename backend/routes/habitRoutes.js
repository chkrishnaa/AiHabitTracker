import express from "express";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  archiveHabit,
  reorderHabits,
} from "../controllers/habitController.js";
import { protect } from "../middlewares/authMiddleware.js";

const habitRouter = express.Router();

habitRouter.use(protect);

habitRouter.get("/", getHabits);
habitRouter.post("/", createHabit);
habitRouter.put("/reorder", reorderHabits);
habitRouter.put("/:id", updateHabit);
habitRouter.delete("/:id", deleteHabit);
habitRouter.put("/:id/archive", archiveHabit);

export default habitRouter;