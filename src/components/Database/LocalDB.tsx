import { useEffect, useRef, useState } from "react";
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from "@capacitor-community/sqlite";

const useSQLiteDB = () => {
  const db = useRef<SQLiteDBConnection>();
  const sqlite = useRef<SQLiteConnection>();
  const [initialized, setInitialized] = useState<Boolean>();

  useEffect(() => {
    const initializeDB = async () => {
      if (sqlite.current) return;

      sqlite.current = new SQLiteConnection(CapacitorSQLite);
      const ret = await sqlite.current.checkConnectionsConsistency();
      const isConn = (await sqlite.current.isConnection("chatdb", false))
        .result;

      if (ret.result && isConn) {
        db.current = await sqlite.current.retrieveConnection("chatdb", false);
      } else {
        db.current = await sqlite.current.createConnection(
          "chatdb",
          false,
          "no-encryption",
          1,
          false
        );
      }
    };

    initializeDB().then(() => {
        initializeTables();
        setInitialized(true);
      });
    
  },[]);

  const performSQLAction = async (
    action: (db: SQLiteDBConnection | undefined) => Promise<void>,
    cleanup?: () => Promise<void>
  ) => {
    try {
      await db.current?.open();
      await action(db.current);
    } catch (error) {
      alert((error as Error).message);
    } finally {
      try {
        (await db.current?.isDBOpen())?.result && (await db.current?.close());
        cleanup && (await cleanup());
      } catch {}
    }
  };

  const initializeTables = async () => {
    performSQLAction(async (db: SQLiteDBConnection | undefined) => {
      const queryCreateTable = `
      CREATE TABLE IF NOT EXISTS chat ( 
        id INTEGER PRIMARY KEY NOT NULL,
        msg TEXT,
        recipient INT NOT NULL,
        sender INT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIEMESTAMP
    );
    `;
      const respCT = await db?.execute(queryCreateTable);
      console.log(`res: ${JSON.stringify(respCT)}`);
    });
  };

  return { performSQLAction, initialized };
};

export default useSQLiteDB;