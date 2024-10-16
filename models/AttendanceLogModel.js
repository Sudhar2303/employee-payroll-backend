const mongoose = require('mongoose');

const attendanceLogSchema = mongoose.Schema(
    {
        employeeID: {
            type: String,
            required: true,
            ref: 'employeeDetails' 
        },
        startTime: {
            type: Date,
            required: true
        },
        endTime: {
            type: Date,

        },
        workingHours :
        {
            type: Number,
        }
    },
    {
        timestamps: true,
        collection: 'attendanceLogs' 
    }
);

module.exports = mongoose.model('attendanceLog', attendanceLogSchema);