const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;


const app = express();
app.use(cors()); //cross-orgin-request different localhost
app.use(express.json());

mongoose.connect("MONGO_URI=mongodb+srv://shanthiarunachalamdev_db_user:ToDoApp@cluster0.1ncbfhu.mongodb.net/ToDoAppDb?retryWrites=true&w=majority").then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Error:", err));

// const UserSchema = new mongoose.Schema({
//     name: String,
//     Completed: Boolean,
//     Id: Date
// });

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    Completed: {
        type: Boolean,
        default: false
    }
});

const User = mongoose.model("users", UserSchema);

// Test route
app.get("/", (req, res) => {
    res.send("Backend working! ");
});

app.post("/Add", async (req, res) => {
    const { name } = req.body;

    const user = new User({ name, Completed: false });
    await user.save();
    console.log(user)
    res.json({ success: true, message: "Added!", data: user });
});

app.get("/Home", async (req, res) => {
    // res.send(users);
    const users = await User.find();
    res.json(users);
});

app.post("/Update/:id", async (req, res) => {

    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const user = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Only one response
        res.json(user);
    } catch (err) {
        // Only one response in case of error
        res.status(500).json({ error: err.message });
    }
    // res.json({ success: true });
});


app.listen(5000, () => console.log(`Server running on port:${PORT}`));
