import fs from "node:fs";
import { parse } from "csv-parse";

const API_URL = "http://localhost:3333/tasks";

async function importCSV() {
  const parser = fs.createReadStream("tasks.csv").pipe(
    parse({
      delimiter: ",",
      fromLine: 2,
      trim: true,
    })
  );

  for await (const record of parser) {
    const [title, description] = record;

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
      }),
    });

    console.log(`Task importada: ${title}`);
  }
}

importCSV()
  .then(() => console.log("Importação finalizada"))
  .catch(console.error);
