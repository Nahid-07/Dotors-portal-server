const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugpmzsn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const appointmentCollections = client.db("appointment").collection("data");
    const bookingsCollections = client.db("appointment").collection("bookings");
    app.get("/appointment", async (req, res) => {
      const date = req.query.date;
      const query = {};
      const options = await appointmentCollections.find(query).toArray();
      //   finding data with date query
      const bookingQuery = { date: date };
      //   getting data by query date and get an array which already booked that date
      const allreadyBooked = await bookingsCollections
        .find(bookingQuery)
        .toArray();
      // looping appointment option because the objective is to find slot that already booked.
      options.forEach((option) => {
        const optionBooked = allreadyBooked.filter(
          (booked) => booked.treatmentName === option.name
        );
        const bookedSlots = optionBooked.map((booked) => booked.slot);
      });
      res.send(options);
    });

    // sending client appointment bookings through this api
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      const result = await bookingsCollections.insertOne(bookings);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => {
  console.log(err.message);
});

app.listen(port, () => {
  console.log("server is running");
});
