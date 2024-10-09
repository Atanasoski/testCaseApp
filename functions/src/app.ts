import express from "express";
import cors from "cors";
import countryRoutes from "./routes/countryRoutes";
import packageRoutes from "./routes/packageRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import { Request, Response, NextFunction } from "express"; 

const app = express();

app.use(cors()); // Enable CORS for all requests
app.use(express.json()); // Parse JSON bodies

// Routes
app.use("/countries", countryRoutes); 
app.use("/packages", packageRoutes); 
app.use("/partners", partnerRoutes);


// // Health Check
// app.get("/", (req: Request, res: Response) => {
//     res.send("Server is running...");
// });

// // Error Handling Middleware
// app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
//     console.error(err.stack);
//     res.status(500).json({ error: "Something went wrong!" });
// });

export default app;
