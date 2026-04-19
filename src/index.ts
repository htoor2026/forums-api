import express from "express";
import dotenv from "dotenv-safe";
import cors from 'cors';
import userRoutes from "./ports/rest/routes/user";
import postRoutes from "./ports/rest/routes/post";
import adminRoutes from "./ports/rest/routes/admin";
import { ConnectToDb } from "./infrastructure/mongodb/connection";

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

dotenv.config();
ConnectToDb();

app.use("/healthcheck", (_req, res) => {
  res.status(200).json({ message: "Successful" });
});

app.use("/user", userRoutes);
app.use("/posts", postRoutes);
app.use("/admin", adminRoutes);

const port = 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
  });
}

export default app;