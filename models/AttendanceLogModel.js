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
            required: true
        },
        workingHours :
        {
            type: Number,
            required : true
        }
    },
    {
        timestamps: true,
        collection: 'attendanceLogs' 
    }
);

module.exports = mongoose.model('attendanceLog', attendanceLogSchema);