// src/models/JDModel.js
class JDModel {
    constructor(userId, jdId, s3Url, uploadedAt) {
      this.userId = userId;
      this.jdId = jdId;
      this.s3Url = s3Url;
      this.uploadedAt = uploadedAt;
    }
  }
  
module.exports = JDModel;
  