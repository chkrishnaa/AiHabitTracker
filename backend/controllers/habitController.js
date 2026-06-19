import Habit from "../models/Habit.js";
import HabitLog from "../models/HabitLog.js";

export const getHabits = async (req, res) => {
    try{
        const { includeArchived } = req.query;
        const filter = { userId: req.user._id };
        if(includeArchived !== "true") filter.isArchived = false;

        const habits = await Habit.find(filter).sort({order:1, createdAt:1});
        res.status(200).json({
            habits
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const createHabit = async (req, res) => {
    try{
        const {
            name,
            description,
            category,
            frequency,
            targetDays,
            color,
            icon,
        } = req.body;
        
        if(!name){
            return res.status(400).json({message: "Habit Name is required"});
        }

        const count = await Habit.countDocuments({userId: req.user._id});
        const habit = await Habit.create({
            userId: req.user._id,
            name,
            description,
            category,
            frequency,
            targetDays,
            color,
            icon,
            order: count,
        });
        res.status(201).json({
            habit
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const updateHabit = async (req, res) =>{
    try{
        const habit = await Habit.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!habit) {
            return res.status(404).json({message: "Habit not found"});
        };

        const fields = [
            "name",
            "description",
            "category",
            "frequency",
            "targetDays",
            "color",
            "icon",
            "order"
        ];

       for(const field of fields){
           if(req.body[field] !== undefined) habit[field] = req.body[field];
       }

       await habit.save();
       res.status(200).json({
           habit
       });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const deleteHabit = async (req, res) => {
    try{
        const habit = await Habit.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!habit) {
            return res.status(404).json({message: "Habit not found"});
        };

        await HabitLog.deleteMany({habitId: habit._id, userId: req.user._id});
        res.status(200).json({
            message: "Habit deleted"
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const archiveHabit = async (req, res) => {
    try{
        const habit = await Habit.findOneAndUpdate({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!habit) {
            return res.status(404).json({message: "Habit not found"});
        };

        habit.isArchived = !habit.isArchived;
        await habit.save();
        res.status(200).json({
            habit
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

export const reorderHabits = async (req, res) => {
    try{
        const {order} = req.body;
        
        if(!Array.isArray(order)){
            return res.status(400).json({message: "Order must be an array"});
        }

        await Promise.all(
            order.map(async (id, index) => {
                Habit.updateOne(
                    {_id: id, userId: req.user._id},
                    { $set: {order: index}}
                );
            })
        );
        res.status(200).json({message: "Habits Reordered"});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};