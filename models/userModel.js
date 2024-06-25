const mongoose = require("mongoose");

// create table properties
const userSchem = mongoose.Schema({
    name: {
        type: String,
        required: [true, "please put your name"]
    },
    email:{
        type: String,
        required: [true, "please enter email"],
        trim: true,
        unique: true,
        match: [/(?:[a-z0-9+!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i, "please put correct mail"],

    },
    password: {
        type: String,
        required: [true, "please enter password"],
        minLength: [6, "minimum character length is 6"],

    },

    photo: {
        type: String,
        required: [true, "please enter password"],
        default: 'https://www.pngarts.com/files/5/Avatar-Face-Transparent.png'
    },
    phone: {
        type: String,
        default: "+2519110090"
    },
    bio:{
        type: String,
        default: 'bio',
        maxLength: [50, "bio shouldn't be greater than 50"]
    }
},{
    timestamps: true
})

// create tabel
const User = mongoose.model("User", userSchem);
module.exports = User;