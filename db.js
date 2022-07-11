const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/24SevenOffice?readPreference=primary&appname=MongoDB%20Compass&ssl=false'
const Admin = require('./models/Admin');
const MainEvent = require('./models/mainEvent');
const bcrypt = require('bcryptjs');

const coonectToMongo = () => {
    mongoose.connect(mongoUri, () => {
        console.log('connected to mongo db successfully');
    })
    seedDB();
}
const sampleEvents=[
    {
        name:'Event-A',
        description:'description for event A',
        date_time:'7/7/2022, 09:00'
    },
    {
        name:'Event-B',
        description:'description for event B',
        date_time:'7/7/2022 11:00'
    },
    {
        name:'Event-C',
        description:'description for event C',
        date_time:'7/7/2022 12:00'
    },
    {
        name:'Event-D',
        description:'description for event D',
        date_time:'7/7/2022 15:00'
    }
]
const seedDB = async () => {
    await Admin.deleteMany({});
    await MainEvent.deleteMany({});
    const salt = bcrypt.genSaltSync(10);
    const saltedPwd = await bcrypt.hash('saswatiPwd', salt);
    const admin = new Admin({
        name: 'Saswati',
        email: 'saswati@247office.com',
        password: saltedPwd
    })
    await admin.save();
 
    for (let index = 0; index <sampleEvents.length ; index++) {
        const event = new MainEvent(sampleEvents[index])
        await event.save();
    }
    console.log('Seeding done!')
}

module.exports = coonectToMongo;