const { Router } = require("express");
const { eventPlannerData, sequelize, eventPlannersData } = require("../models");

const router = Router();

router.get("/:eventPlannerDataId", async (req, res) => {
    const { eventPlannerDataId } = req.params;

    try {
        const result = await eventPlannersData.getByUserId(eventPlannerDataId);

        if(!result) {
            return res.status(404).json({
                message: "No event planner data found.",
            });
        }

        return res.status(200).json({
            message: "Event planner data found",
            result,
        });

    } catch(error) {
        console.error("Unable to get event planners data: " + error);
        
        return res.status(500).json({
            message: "Unable to get event planner data",
        });
    }
});