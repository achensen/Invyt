import express, { Request, Response } from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const router = express.Router();

const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY;

router.get("/events", async (req: Request, res: Response) => {
  try {
    if (!TICKETMASTER_API_KEY) {
      console.error("❌ Missing Ticketmaster API Key");
      return res.status(500).json({ error: "Ticketmaster API Key is missing." });
    }

    const { lat, long } = req.query;
    if (!lat || !long) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const url = `https://app.ticketmaster.com/discovery/v2/events.json`;
    const response = await axios.get(url, {
      params: {
        apikey: TICKETMASTER_API_KEY,
        latlong: `${lat},${long}`,
        radius: 50,
        unit: "miles",
        size: 10,
        sort: "date,asc",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data?._embedded?.events) {
      return res.json(response.data._embedded.events);
    } else {
      return res.status(404).json({ message: "No events found." });
    }
  } catch (error) {
    console.error("Error fetching Ticketmaster events:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;