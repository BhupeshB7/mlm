const mongoose = require('mongoose');
const TopupHistory = require('./models/TopUpHistory'); // Adjust the path accordingly
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  // Fetch 10-15 details based on userId
  async function fetchTopupHistory(userId) {
    try {
      const results = await TopupHistory.find({ userId }).limit(15);
      console.log(JSON.stringify(results, null, 2));
    } catch (error) {
      console.error('Error fetching top-up history:', error);
    } finally {
      mongoose.disconnect(); // Close the connection after fetching data
    }
  }

  // Upload 15-20 data with all details
  async function uploadTopupHistory() {
    try {
      const dataToUpload = 
    //   [
    //     // Include 15-20 data objects with all details here
    //     // Example: { name: 'John Doe', userId: '123', targetUserId: '456', amount: 100 },
    //     // ...
    //   ];
    [
        {
          "_id": "6575ec82db6c980a25456aae",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 850,
          "createdAt": "2023-12-10T16:51:14.767Z",
          "updatedAt": "2023-12-10T16:51:14.767Z",
          "__v": 0
        },
        {
          "_id": "6575ecc5d852080a2eee6d63",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 850,
          "createdAt": "2023-12-10T16:52:21.008Z",
          "updatedAt": "2023-12-10T16:52:21.008Z",
          "__v": 0
        },
        {
          "_id": "657845e71785209df1231bb8",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 850,
          "createdAt": "2023-12-12T11:37:11.360Z",
          "updatedAt": "2023-12-12T11:37:11.360Z",
          "__v": 0
        },
        {
          "_id": "657a9040b685207c1623e452",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 850,
          "createdAt": "2023-12-14T05:18:56.269Z",
          "updatedAt": "2023-12-14T05:18:56.269Z",
          "__v": 0
        },
        {
          "_id": "6582b57569385209a2e41014",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI75430878",
          "amount": 850,
          "createdAt": "2023-12-20T09:35:49.644Z",
          "updatedAt": "2023-12-20T09:35:49.644Z",
          "__v": 0
        },
        {
          "_id": "6582b57569eee409a2e41014",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 1700,
          "createdAt": "2023-12-24T13:34:08.764Z",
          "updatedAt": "2023-12-24T13:34:08.764Z",
          "__v": 0
        },
        {
          "_id": "65942c0a305728888cac1234",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 1700,
          "createdAt": "2024-01-02T15:30:18.840Z",
          "updatedAt": "2024-01-02T15:30:18.840Z",
          "__v": 0
        },
        {
          "_id": "659a3b5b0000erdb70ecqw12",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 1700,
          "createdAt": "2024-01-07T05:49:15.650Z",
          "updatedAt": "2024-01-07T05:49:15.650Z",
          "__v": 0
        },
        {
          "_id": "6cccc3ddd7d45c7878dfaswe",
          "name": "Testing",
          "userId": "PI21820725",
          "targetUserId": "PI1406954434",
          "amount": 1700,
          "createdAt": "2024-01-21T07:12:29.835Z",
          "updatedAt": "2024-01-21T07:12:29.835Z",
          "__v": 0
        }
      ]
      const insertedData = await TopupHistory.insertMany(dataToUpload);
      console.log('Successfully uploaded data:', insertedData);
    } catch (error) {
      console.error('Error uploading top-up history:', error);
    } finally {
      mongoose.disconnect(); // Close the connection after uploading data
    }
  }

  // Uncomment and use one of the following functions based on your requirement
  await fetchTopupHistory('PI79409915');
//   await uploadTopupHistory();
}); 
[
    {
      "_id": "6575ec82db6c980a25d76aae",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 850,
      "createdAt": "2023-12-10T16:51:14.767Z",
      "updatedAt": "2023-12-10T16:51:14.767Z",
      "__v": 0
    },
    {
      "_id": "6575ecc5db6c980a25d76d63",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 850,
      "createdAt": "2023-12-10T16:52:21.008Z",
      "updatedAt": "2023-12-10T16:52:21.008Z",
      "__v": 0
    },
    {
      "_id": "657845e717afac9df8781bb8",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 850,
      "createdAt": "2023-12-12T11:37:11.360Z",
      "updatedAt": "2023-12-12T11:37:11.360Z",
      "__v": 0
    },
    {
      "_id": "657a9040b616b37c1623e503",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 850,
      "createdAt": "2023-12-14T05:18:56.269Z",
      "updatedAt": "2023-12-14T05:18:56.269Z",
      "__v": 0
    },
    {
      "_id": "6582b57569356199a2e41af8",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI75430878",
      "amount": 850,
      "createdAt": "2023-12-20T09:35:49.644Z",
      "updatedAt": "2023-12-20T09:35:49.644Z",
      "__v": 0
    },
    {
      "_id": "658833506692e7507ed1ff42",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 1700,
      "createdAt": "2023-12-24T13:34:08.764Z",
      "updatedAt": "2023-12-24T13:34:08.764Z",
      "__v": 0
    },
    {
      "_id": "65942c0a305723743cac6412",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 1700,
      "createdAt": "2024-01-02T15:30:18.840Z",
      "updatedAt": "2024-01-02T15:30:18.840Z",
      "__v": 0
    },
    {
      "_id": "659a3b5b3b4401db70ecc699",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 1700,
      "createdAt": "2024-01-07T05:49:15.650Z",
      "updatedAt": "2024-01-07T05:49:15.650Z",
      "__v": 0
    },
    {
      "_id": "65acc3ddd7d45c4320df4b92",
      "name": "Sanjiv kumar",
      "userId": "PI79409915",
      "targetUserId": "PI1406954434",
      "amount": 1700,
      "createdAt": "2024-01-21T07:12:29.835Z",
      "updatedAt": "2024-01-21T07:12:29.835Z",
      "__v": 0
    }
  ]