// scripts/saveDefaultCars.ts
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import DefaultCar from "@/models/DefaultCar"; // adjust path as needed
import { connectToDB } from "@/lib/mongodb"; // your MongoDB connect function

async function saveDefaultCars() {
    await connectToDB();

    const folderPath = path.join(process.cwd(), "public/assets/3d");
    const files = fs.readdirSync(folderPath).filter((file) => file.endsWith(".glb"));

    const glbPaths = files.map((file) => `/assets/3d/${file}`);
    const names = files.map((file) => file.replace(".glb", ""));

    // Check if a document with any of these glbPaths exists
    const existing = await DefaultCar.findOne({ glbPaths: { $in: glbPaths } });

    if (!existing) {
        // If no document exists with any of the paths, create a new one
        await DefaultCar.create({ name: "Default Cars", glbPaths });
        console.log(`Saved default cars to DB`);
    } else {
        // If a document exists, check if it has all the paths
        const allPathsExist = glbPaths.every(path => existing.glbPaths.includes(path));
        if (!allPathsExist) {
          existing.glbPaths = [...new Set([...existing.glbPaths, ...glbPaths])];
          await existing.save();
          console.log(`Updated existing default cars document with new paths.`);
        } else {
            console.log(`${name} already exists`);
        }
    }

    console.log("Done");
    process.exit();
}

saveDefaultCars();
