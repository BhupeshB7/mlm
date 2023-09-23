// // import necessary modules and models
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// router.get('/userlevel/:userId', async (req, res)=>{
//     const {userId} = req.params;
//     try{
//         const user = await User.findOne({userId: userId});
        
//     if (!user) {
//         return res.status(404).json({ message: 'User not found.' });
//       }
  
//    let sponsor = await User.findOne({userId: userId.sponsorId});
//    if(sponsor){
//     return res.json('level : 1')
//    }
//    let sponsor1 = await User.findOne({userId: sponsor.sponsorId});
//    if(sponsor1){
//     return res.json('level: 2')
//    }
//    let sponsor2 = await User.findOne({userId: sponsor1.sponsorId});
//    if(sponsor2){
//     return res.json('level : 3')
//    }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Internal server error.' });
//   }
// })
// module.exports = router