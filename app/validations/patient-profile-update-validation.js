const Patient = require('../models/patient-model');
const Doctor=require('../models/doctor-model')

const patientProfileValidationSchema = {

    firstName: {
        exists: { errorMessage: 'First name is required' },
        notEmpty: { errorMessage: 'First name should not be empty' },
        trim: true
    },

    lastName: {
        exists: { errorMessage: 'Last name is required' },
        notEmpty: { errorMessage: 'Last name should not be empty' },
        trim: true
    },

    mobile: {
        exists: { errorMessage: 'mobile number is required' },
        notEmpty: { errorMessage: 'mobile number should not be empty' },
        isMobilePhone: { errorMessage: 'mobile number should be valid' },
        custom:{
            options:async function(value,{req}){
                const patient=await Patient.findOne({mobile:value})
                const doctor=await Doctor.findOne({mobile:value})
                if ((patient && patient.userId.toString() !== req.user.id.toString()) || (doctor && doctor.userId.toString() !== req.user.id.toString())) {
                    throw new Error('Mobile number already exists');
                }
                return true
            }
        }
    },

    profilePic:{
        custom: {
            options: (value, { req }) => {
                if (req.file) {
                    const file = req.file;
                    const allowedTypes = ['image/jpeg', 'image/png'];
                    if (!allowedTypes.includes(file.mimetype)) {
                        throw new Error('Invalid file type');
                    }
                }
                return true;
            }
        }
    },

    address:{
        exists: { errorMessage: 'address is required' },
        notEmpty: { errorMessage: 'address should not be empty' },
        trim:true
    },

    pincode:{
        exists: { errorMessage: 'pincode is required' },
        notEmpty: { errorMessage: 'pincode should not be empty' },
        trim:true,
        custom:{
                options: (value) => {
                    // Validate pin code format (6 digits)
                    const pincodeRegex = /^[1-9][0-9]{5}$/;
                    if (!pincodeRegex.test(value)) {
                        throw new Error('Invalid pin code. Please enter a valid 6-digit pin code');
                    }
                    return true;
                }
            }
        }
    };
    
module.exports = patientProfileValidationSchema;
