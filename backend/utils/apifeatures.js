class ApiFeatures {
    constructor(query, queryStr) {
      this.query = query;
      this.queryStr = queryStr;
    }
  
    search() {
      const keyword = this.queryStr.keyword
        ? {
            name: {
              $regex: this.queryStr.keyword,
              $options: "i",
            },
          }
        : {};
      this.query = this.query.find({ ...keyword });
      return this; //Returning the class
    }
  
    filter() {
      const queryCopy = { ...this.queryStr };
  
      //Removing some fields for category
  
      //Filter for category
      const removeFields = ["Keyword", "page", "limit"];
  
      removeFields.forEach((key) => delete queryCopy[key]);
  
      //filter for price and rating
  
      let queryStr = JSON.stringify(queryCopy);
  
      //now in query we have gt /lt / get /lte but in mongodb we need $gt,$lt etc 
      //so replaceing gt with $gt lt with $lt etc...
  
      queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);
      this.query = this.query.find(JSON.parse(queryStr));
  
      return this;
    }
  
    pagination(resultPerPage){
      const currentPage=this.queryStr.page || 1;
      const skip=resultPerPage*(currentPage-1)
  
      this.query=this.query.limit(resultPerPage).skip(skip);
      return this;
    }
  
  }
  
  module.exports = ApiFeatures;
  