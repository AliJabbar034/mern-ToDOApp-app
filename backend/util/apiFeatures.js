export class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  //   search() {
  //     const keyword = this.queryStr.keyword
  //       ? {
  //           name: {
  //             $regex: this.queryStr.keyword,
  //             $options: "i",
  //           },
  //         }
  //       : {};

  //     this.query = this.query.find({
  //       ...keyword,
  //     });

  //     return this;
  //   }
  filter() {
    const newQueryStr = { ...this.queryStr };
    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((key) => delete newQueryStr[key]);

    let queryStr = JSON.stringify(newQueryStr);

    queryStr = queryStr.replace(/\b(gt|gte|lt|eq|lte)\b/g, (key) => `$${key}`);

    return this;
  }
}
