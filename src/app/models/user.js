import mongoose from "mongoose";

// Define the Mongoose schema for the User document
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    profilePicture: {
      type: String, // URL to the profile picture
      default: '',
    },
    bio: {
      type: String,
      maxLength: [160, 'Bio must not exceed 160 characters'],
      default: 'heelo baccho',
    },
    
    links: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        icon: { type: String, default: '' },
        
      },
    ],
    theme: {
      type: String, // Reference to the user's chosen theme
      default: 'default',
    },
    socialMediaHandles: {
     facebook:{type:String},
     Github:{type:String},
     Linkedin:{type:String},
     Instagram:{type:String},
     Twitter:{type:String},
     Youtube:{type:String},
    },
    createdAt: {
      type: Date,
      default: Date.now, // Mongoose automatically uses `Date.now` here
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Mongoose automatically uses `Date.now` here
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook to update `updatedAt` field
userSchema.pre('save', function (next) {
  this.updatedAt = new Date(); // Ensure updatedAt is a Date object
  next();
});

// Export the model
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
