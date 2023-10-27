const { Router } = require("express");
const { events, artists, sequelize } = require("../models");

const router = Router();

router.post("/addEvent", async (req, res) => {
    const { name, genre, description, location, userId, bandsAndArtists } = req.body;
    const t = await sequelize.transaction();

    try {
        const event = await events.createEvent(
            name,
            genre,
            description,
            location,
            userId,
            t
        );

        for (const artist of bandsAndArtists) {
            await artists.addArtist(
                artist.name,
                event.eventId,
                t
            );
        }

        await t.commit();

        return res.status(200).json({
            message: "Event created",
            eventId: event.eventId,
        });
        
    } catch (error) {
        console.error("Unable to create event: " + error);
        await t.rollback();

        return res.status(500).json({
            message: "Unable to create event",
        });
    }
});

router.get("/getAll/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const allEvents = await events.getAllUserEvents(userId);

        if(allEvents.length === 0) {
            return res.status(404).json({
                message: "No events found",
            });
        }

        return res.status(200).json({
            message: "Events found",
            allEvents,
        });

    } catch(error) {
        console.error("Unable to get events: " + error);
        
        return res.status(500).json({
            message: "Unable to get events",
        });
    }
});

module.exports = router;
