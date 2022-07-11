const express = require('express');
const Events = require('../models/Events');
const User = require('../models/User');
const MainEvent = require('../models/mainEvent');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const fetchAdmin= require('../middleware/fetchAdmin');
const { body, validationResult } = require('express-validator');

//Route 1: Gets all events from api/events/fetchallevents of a loggedin User
router.get('/fetchallevents', fetchuser, async (req, res) => {
    try {
        const events = await Events.find({ user: req.user.id })
        res.json(events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})

//Route 2: Add new events using api/events/addEvent of a loggedin User
router.post('/addEvent', fetchuser, [
    body('event_name', 'Enter a valid event name').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    /* const { main_event_id, event_name, description } = req.body; */
    const { event_name, description } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id);
        /* const event = new Events({main_event_id, event_name, description, user: req.user.id }) */
        const event = new Events({ event_name, description, user: req.user.id })
        user.events.push(event);
        const savedEvent = await event.save();
        await user.save();
        res.json(savedEvent);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})

// ROUTE 3: Update an existing event using: POST "/api/events/updateEvent". Login required
router.put('/updateEvent/:id', fetchuser, async (req, res) => {
    const { event_name, description } = req.body;
    try {
        // Create a event object
        const newEvent = {};
        if (event_name) { newEvent.event_name = event_name };
        if (description) { newEvent.description = description };

        // Find the event to be updated and update it
        let event = await Events.findById(req.params.id);
        if (!event) { return res.status(404).send("Event Not Found") }

        if (event.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed to edit the event");
        }

        event = await Events.findByIdAndUpdate(req.params.id, { $set: newEvent }, { new: true })
        res.json({ event });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }
})

// ROUTE 4: Delete an existing Note using: DELETE "/api/notes/deletenote". Login required
router.delete('/deleteEvent/:id', fetchuser, async (req, res) => {

    try {
        // Find the event to be deleted and delete it
        let event = await Events.findById(req.params.id);
        if (!event) { return res.status(404).send("Event Not Found") }

        if (event.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed to delete the event");
        }
        await User.findByIdAndUpdate(req.user.id, { $pull: { events: req.params.id } });
        event = await Events.findByIdAndDelete(req.params.id)
        res.json({ success: 'Event has been deleted successfully', event });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})


//Route 5: Gets all main events from api/events/fetchallmainevents of a loggedin User
router.get('/fetchallmainevents', fetchuser, async (req, res) => {
    try {
        const main_events = await MainEvent.find({})
        res.json(main_events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})


module.exports = router;