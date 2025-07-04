const Marks = require('../models/marks');

// Create a new mark entry
const createMark = async (req, res) => {
    const { pname, ptype, marks } = req.body;

    const newmark = new Marks({
        pname,
        ptype,
        marks
    });

    try {
        await newmark.save();
        res.status(201).json(newmark);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to create mark' });
    }
};

// Get all marks
const getmarks = async (req, res) => {
    try {
        const marks = await Marks.find();
        res.status(200).json(marks);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Failed to fetch marks' });
    }
};



module.exports = {
    createMark,
    getmarks,
   
};
