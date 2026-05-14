import express from "express";
import router from "./routes/routes";
import cors from "cors";

const app = express();
app.use(express.json());

// Разрешить CORS для всех доменов
app.use(
  cors({
    origin: "*", // Разрешить все домены
    methods: ["GET", "POST", "PUT", "DELETE"], // Разрешенные HTTP-методы
    allowedHeaders: ["Content-Type", "Authorization"], // Разрешенные заголовки
  }),
);

app.use("/api", router);

const port = 8082;

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
