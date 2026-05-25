import express, {Router} from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import questionRoutes from "./routes/question.js"
import userRoutes from "./routes/user.js"

dotenv.config();



const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../../files");



app.use(cors())
app.use(express.json());
app.use(express.static(frontendPath));
app.use('/user', userRoutes);
app.use('/question', questionRoutes);





export default app;
