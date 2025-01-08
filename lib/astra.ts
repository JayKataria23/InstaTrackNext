import { DataAPIClient } from "@datastax/astra-db-ts";

// Initialize the client
const client = new DataAPIClient(
  "AstraCS:fjGSQtoCnbjdrpMYHTWbCUQQ:e24a7c6d4288ce69b7e3e6e3e015ad73e6546c31c6d75c44aee5dec8ec4e5828"
);
export const db = client.db(
  "https://ccf314e5-a0d1-44eb-ab60-93907068b803-us-east-2.apps.astra.datastax.com"
);


