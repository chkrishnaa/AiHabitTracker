import express from "express";
import {
    markComplete,
    unmarkComplete,
    getToday,
    getRange,
    getHeatmap,
    getHabitStats,
    getAllStats,
} from "../controllers/logController.js";

import { protect } from "../middlewares/authMiddleware.js";

const logRouter = express.Router();

logRouter.use(protect);

logRouter.post("/", markComplete);
logRouter.delete("/", unmarkComplete);
logRouter.get("/today", getToday);
logRouter.get("/range", getRange);
logRouter.get("/heatmap", getHeatmap);
logRouter.get("/stats/:habitId", getHabitStats);
logRouter.get("/stats", getAllStats);

export default logRouter;