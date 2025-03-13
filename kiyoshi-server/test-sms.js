require('dotenv').config();
const twilio = require('twilio');

const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
  .create({
    body: "Hello from Kiyoshi’s Twilio setup! 🎉",
    from: process.env.TWILIO_PHONE_NUMBER,
    to: "+19059229103"  // Replace with your verified phone number
  })
  .then((message) => console.log(`Message sent! SID: ${message.sid}`))
  .catch((error) => console.error("Error sending message:", error));