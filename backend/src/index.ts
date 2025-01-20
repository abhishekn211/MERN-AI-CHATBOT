import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

//connections and listeneres
const PORT = process.env.PORT || 5000;

// Connect to database before starting server
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });
