import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
    {
        first_name: {
            type: String,
            required: [true, "Please Enter First Name"],
            trim: true,
        },
        last_name: {
            type: String,
            required: [true, "Please enter last name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: [true, "Email address is already used"],
            trim: true,
        },
        gender: {
            type: String,
            required: [true, "Please select gender"],
            enum: {
                values: ["male", "female", "other"],
                message: "Gender must be male, female, or other",
            },
        },
        designation: {
            type: String,
            required: [true, "Please enter designation"],
            trim: true,
        },
        salary: {
            type: Number,
            min: [1000, "Salary must be over 1000"]
        },
        date_of_joining: {
            type: Date,
            default: Date.now,
        },
        department: {
            type: String,
            required: [true, "Please enter department"],
            trim: true,
        },
        employee_photo: {
            type: String,
            trim: true,
        },
        created_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    },
);

export default mongoose.model("Employee", EmployeeSchema);