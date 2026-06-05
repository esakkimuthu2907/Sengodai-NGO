require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function run(){
  try{
    await mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});
    const exists = await User.findOne({email:process.env.ADMIN_EMAIL});
    if(exists){
      console.log('Admin already exists');
    } else {
      const admin = await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        phone: process.env.ADMIN_PHONE.replace('+',''),
        location: process.env.ADMIN_LOCATION,
        bloodGroup: process.env.ADMIN_BLOODGROUP,
        status: 'Approved'
      });
      console.log('Admin created', admin._id);
    }
    process.exit();
  }catch(e){
    console.error('Error',e);
    process.exit(1);
  }
}
run();
