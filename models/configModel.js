const mongoose = require("mongoose");
const slugify = require("slugify");

const configSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    type: { type: String },
    target: { type: String, required: true },
    APIKey: { type: String, required: true, unique: true },
    appID: { type: Number, required: true },
    favourite: { type: Boolean, default: false },
    slug: { type: String, unique: true },
  },
  { timestamps: true }
);

configSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Config = mongoose.model("configs", configSchema);

module.exports = Config;
