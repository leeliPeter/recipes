import type { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import Recipe from "@/models/Recipe";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  switch (req.method) {
    case "GET":
      try {
        const recipes = await Recipe.find({});
        res.status(200).json(recipes);
      } catch (error) {
        res.status(500).json({ error: "Error fetching recipes" });
      }
      break;

    case "POST":
      try {
        const recipe = await Recipe.create(req.body);
        res.status(201).json(recipe);
      } catch (error) {
        res.status(500).json({ error: "Error creating recipe" });
      }
      break;

    default:
      res.status(405).json({ error: "Method not allowed" });
  }
}
