const mongoose = require('mongoose')

const ProfileSchema = new mongoose.Schema({
name: {
    // this links this schema to the user schema...
    // via object id
   user: {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'user'
   },
   company: {
       type: String
   },
   website: {
       type:String
   },
   location: {
       type:String
   },
   status: {
       type:String,
       required:true
   },
   skills: {
       type:[String],
       required:true
   },
   bio: {
       type:String
   },
   githubUsername: {
       type:String 
   }
}, 
experience: [
   { 
       title: {
        type:String,
        required:true
    },
    company: {
        type: String,
        required: true
    },
    location: {
    type:String    
    },
    from: {
        type:Date,
        required:true
    },
    to:{
        type:Date
    },
    description: {
        type:String
    }
}
],
education: [
    {
        school: {
            type:String,
            required:true
        },
        degree: {
            type:String,
            required:true
        },
        fieldOfStudy: {
            type:String,
            required:true
        },
        from: {
            type:Date,
            required:true
        },
        to:{
            type:Date
        },
        current: {
            type:Boolean,
            default: false
        },
        description: {
            type:String
        }
    }
],
social: {
    youtube: {
        type:String
    },
    Facebook: {
        type:String
    },
    Linkedin: {
        type:String
    },
    Instagram: {
        type:String
    }
},
date: {
    type:Date
}
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);