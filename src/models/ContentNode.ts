import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript
export interface IContentNode extends Document {
  _id: string;
  slug: string;
  title: string;
  summary?: string;
  type: "category" | "chapter" | "article";
  author?: string;
  createdAt: Date;
  updatedAt: Date;
  badge?: "coming-soon" | number;
  body?: string; // Only for articles
  parentId?: string; // Reference to parent node
  path: string[]; // Array of parent slugs for hierarchical navigation
  order: number; // For ordering within parent
  published: boolean;
  icon?: string;
}

// Mongoose Schema
const ContentNodeSchema = new Schema<IContentNode>(
  {
    slug: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      index: true,
    },
    summary: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
      enum: ["category", "chapter", "article"],
      index: true,
    },
    author: {
      type: String,
      default: "",
    },
    badge: {
      type: Schema.Types.Mixed, // Can be 'coming-soon' string or number
      default: null,
    },
    body: {
      type: String,
      default: "", // Only used for articles
    },
    parentId: {
      type: String,
      default: null,
      index: true,
    },
    icon: {
      type: String,
      default: null,
    },
    path: {
      type: [String],
      default: [],
      index: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    collection: "content_nodes",
  },
);

// Compound indexes for better query performance
ContentNodeSchema.index({ parentId: 1, order: 1 });
ContentNodeSchema.index({ type: 1, published: 1 });
ContentNodeSchema.index({ path: 1, slug: 1 });

// Virtual for getting children
ContentNodeSchema.virtual("children", {
  ref: "ContentNode",
  localField: "_id",
  foreignField: "parentId",
  options: { sort: { order: 1 } },
});

// Ensure virtual fields are serialized
ContentNodeSchema.set("toJSON", { virtuals: true });
ContentNodeSchema.set("toObject", { virtuals: true });

// Static methods for common queries
ContentNodeSchema.statics.findByPath = function (pathArray: string[]) {
  return this.findOne({
    path: pathArray.slice(0, -1),
    slug: pathArray[pathArray.length - 1],
    published: true,
  });
};

ContentNodeSchema.statics.findChildren = function (parentId: string) {
  return this.find({
    parentId: parentId,
    published: true,
  }).sort({ order: 1 });
};

ContentNodeSchema.statics.searchContent = function (
  query: string,
  limit: number = 8,
) {
  return this.find({
    $and: [
      { published: true },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { summary: { $regex: query, $options: "i" } },
          { body: { $regex: query, $options: "i" } },
        ],
      },
    ],
  }).limit(limit);
};

// Pre-save middleware to ensure path consistency
ContentNodeSchema.pre("save", async function (next) {
  if (this.parentId) {
    const Model = this.constructor as mongoose.Model<IContentNode>;
    const parent = await Model.findById(this.parentId);
    if (parent) {
      this.path = [...parent.path, parent.slug];
    }
  } else {
    this.path = [];
  }
  next();
});

// Export the model
const ContentNode =
  mongoose.models.ContentNode ||
  mongoose.model<IContentNode>("ContentNode", ContentNodeSchema);

export default ContentNode;
