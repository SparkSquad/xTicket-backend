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
                artist,
                event.eventId,
                t
            );
        }

        await t.commit();

        return res.status(200).json({
            code: event.eventId,
        });
        
    } catch (error) {
        console.error("Unable to create event: " + error);
        await t.rollback();

        return res.status(500).json({
            code: -1
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

router.get("/getAll", async (req, res) => {
    try {
        const allEvents = await events.findAll();
        return res.status(200).json(allEvents);

    } catch(error) {
        console.error("Unable to get events: " + error);
        return res.status(500).json({
            message: "Unable to get events",
        });
    }
});

router.get("/getGenres", async (req, res) => {
    try {
        const genres = await events.getGenres();

        return res.status(200).json({
            message: "Genres found",
            genres,
        });
    } catch(error) {
        console.error("Unable to get genres: " + error);

        return res.status(500).json({
            message: "Unable to get genres",
        });
    }
});

router.put("/updateEvent", async (req, res) => {
    const { name, genre, description, location, bandsAndArtists, eventId } = req.body;
    const t = await sequelize.transaction();

    try {
        await events.updateEvent(
            name,
            genre,
            description,
            location,
            eventId,
            t
        );

        await artists.deleteAllArtists(eventId, t);

        for(const artist of bandsAndArtists) {
            await artists.addArtist(
                artist,
                eventId,
                t
            )
        }

        await t.commit();

        return res.status(200).json({
            message: "Event updated",
        });
    } catch(error) {
        console.error("Unable to update event: " + error);
        await t.rollback();

        return res.status(500).json({
            message: "Unable to update event",
        });
    }
});

module.exports = router;
