const mongoose = require('mongoose')

const topupHistorySchema =new mongoose.Schema({
 
    // name :{
    //     type:String
    // },
    userId :{
        type:String
    },
    targetUserId :{
        type:String
    }
},{
    timestamps:true
})

module.exports = mongoose.model('TopupUser', topupHistorySchema)