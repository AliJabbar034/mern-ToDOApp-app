import { config } from "dotenv";
import { app } from "./app.js";
import { createConnection } from "./config/database.js";

config({
  path: "backend/config/config.env",
});

await createConnection();

const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
