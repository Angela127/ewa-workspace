import fsPromises from "fs/promises";
import path from "path";

// Ensure that the `data` is correctly inferred as the type of your JSON data
import data from '@root/json/avatarConfig.json';

// Automatically infer the type from the actual data
export type JSONType = typeof data;

// Read and return the local data
export async function getLocalData() {
  // Get the path of the json file
  const filePath = path.join(process.cwd(), "json/avatarConfig.json");
  // Read the json file
  const jsonData = await fsPromises.readFile(filePath, "utf-8"); // Specify 'utf-8' to get a string
  // Parse data as json
  const objectData = JSON.parse(jsonData);

  return objectData;
}
