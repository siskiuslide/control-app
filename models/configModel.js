const mongoose = require("mongoose");
const slugify = require("slugify");

const configSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    type: { type: String, default: "on" },
    target: { type: String, required: true },
    APIKey: { type: String, required: true, unique: true },
    appID: { type: Number, required: true },
    favourite: { type: Boolean, default: false },
    polling: { type: String, default: "off" },
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
