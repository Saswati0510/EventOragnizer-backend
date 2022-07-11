const express = require('express');
const Events = require('../models/Events');
const User = require('../models/User');
const MainEvent = require('../models/mainEvent');
const router = express.Router();
const fetchAdmin = require('../middleware/fetchAdmin');



//Route 1: Gets all main events from api/admin/fetchEventsByAdmin of a loggedin Admin
router.get('/fetchEventsByAdmin', fetchAdmin, async (req, res) => {
    try {
        const main_events = await MainEvent.find({})
        res.json(main_events);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})



//get all users with their events

router.get('/allUsersByAdmin', fetchAdmin, async (req, res) => {
    try {
        const users = await User.find({}).populate('events')
        
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})

//get all users with their events

router.delete('/deleteUserByAdmin/:id', fetchAdmin, async (req, res) => {
    try {
        // Find the event to be deleted and delete it
        let user = await User.findById(req.params.id);
        if (!user) { return res.status(404).send("User Not Found") }

        user = await User.findByIdAndDelete(req.params.id)
        res.json({ success: 'User deleted successfully', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

})


//get a event with its user

/* router.get('/eventWithUsers/:e', fetchAdmin, async (req, res) => {
    try {
        const users = await Events.find({ event_name: req.params.e })
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error')
    }

}) */



module.exports = router;