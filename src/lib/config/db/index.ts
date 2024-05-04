import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema"

const initDB = () => {
    const client = createClient({ url: "file:./.data/local.sqlite" })
    const db = drizzle(client, { schema })
    return db
}




export type DB = ReturnType<typeof initDB>;
export default initDB;