import User from "../models/user.js";
import Employee from "../models/employee.js";
import bcrypt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";

const resolvers = {

    Query: {
        login: async (_, {usernameOrEmail, password}) => {

            const user = await User.findOne({
                // query to find if there's a user with the emil or username form the usernameOrEmail arg
                $or: [
                    {username: usernameOrEmail},
                    {email: usernameOrEmail}
                ]
            });

            if (!user) {
                throw new Error("User not found");
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                throw new Error("Wrong password");
            }

            return "Login Successful";
        },

        getAllEmployees: async () => {
            return await Employee.find();
        },
        getEmployeeByEid: async (_, {id}) => {
            return await Employee.findById(id)
        },

        searchEmployee: async (_, {designation, department}) => {
            const searchTerm = {};

            if (designation) searchTerm.designation = designation;
            if (department) searchTerm.department = department;

            return await Employee.find(searchTerm);
        },
    },

    Mutation: {

        signup: async (_, {username, email, password}) => {

            const existingUser = await User.findOne({
                $or: [{username},
                    {email}]
            });

            if (existingUser) {
                throw new Error("User already exists");
            }

            //hash passowrd
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                username,
                email,
                password: hashedPassword
            });

            return newUser.save();
        },

        addEmployee: async (_, emp) => {
            //u[pload user profile pic
            const uploadResult = await cloudinary.uploader.upload(
                emp.employee_photo
            );

            //emp photo url
            emp.employee_photo = uploadResult.secure_url;

            const employee = new Employee(emp);

            return employee.save();
        },


        updateEmployee: async (_, {id, input}) => {
            return await Employee.findByIdAndUpdate(
                id,
                input,
                {new: true, runValidators: true}
            )
        },

        deleteEmployee: async (_, {id}) => {
            const deleted = await Employee.findByIdAndDelete(id);

            if (!deleted) {
                throw new Error("Employee not found");
            }

            return "Employee deleted successfully";
        }
    }
};

export default resolvers;