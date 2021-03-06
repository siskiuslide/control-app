class APITool {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  sort() {}
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));
    return this;
  }
  limit() {}
}

module.exports = APITool;
