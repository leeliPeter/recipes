import mongoose, { Schema, Document } from "mongoose";

// Base interface for recipe data
export interface IRecipeData {
  _id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
}

// Interface for Mongoose document
export interface IRecipeDocument extends Omit<Document, "_id"> {
  _id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  ingredients: string[];
  steps: string[];
}

const RecipeSchema = new Schema<IRecipeDocument>(
  {
    _id: {
      type: String,
      required: true,
      validate: {
        validator: function (v: string) {
          return /^recipe\d{3}$/.test(v);
        },
        message: (props) =>
          `${props.value} is not a valid recipe ID! Format should be 'recipe' followed by 3 digits`,
      },
    },
    name: {
      type: String,
      required: [true, "Please provide a recipe name"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
    },
    difficulty: {
      type: String,
      required: [true, "Please specify the difficulty level"],
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "{VALUE} is not a valid difficulty level",
      },
      trim: true,
    },
    ingredients: [
      {
        type: String,
        required: [true, "Please provide ingredients"],
        trim: true,
        minlength: [3, "Each ingredient must be at least 3 characters long"],
      },
    ],
    steps: [
      {
        type: String,
        required: [true, "Please provide cooking steps"],
        trim: true,
        minlength: [10, "Each step must be at least 10 characters long"],
      },
    ],
  },
  {
    _id: false, // Disable auto-generated ObjectId
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false, // Remove __v field
  }
);

// Add indexes
RecipeSchema.index({ name: 1 });
RecipeSchema.index({ difficulty: 1 });

// Add methods if needed
RecipeSchema.methods.toJSON = function () {
  const recipe = this.toObject();
  return {
    _id: recipe._id,
    name: recipe.name,
    description: recipe.description,
    difficulty: recipe.difficulty,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };
};

// Prevent model recompilation in development
const Recipe =
  mongoose.models.Recipe ||
  mongoose.model<IRecipeDocument>("Recipe", RecipeSchema);

export default Recipe;
