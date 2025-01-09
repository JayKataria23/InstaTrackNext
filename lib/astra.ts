import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize the client
const client = new DataAPIClient(
  process.env.DB_TOKEN
);
export const db = client.db(
  "https://ccf314e5-a0d1-44eb-ab60-93907068b803-us-east-2.apps.astra.datastax.com"
);


