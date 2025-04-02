import express from "express";
import { dynamoDB } from "../config/awsConfig.js";

const router = express.Router();

router.get("/questions", async (req, res) => {
  console.log("called : GET /api/questions");
  try {
    console.log("req.query : ", req.query);
    const { jdId } = req.query;
    console.log("jdId : ", jdId);
    if (!jdId) {
      return res.status(400).json({ message: "jdId is required" });
    }

    const params = {
      TableName: "JDQuestions",
      KeyConditionExpression: "jdId = :jdId",
      ExpressionAttributeValues: {
        ":jdId": jdId,
      },
    };

    console.log("params : ", params);
    const { Items } = await dynamoDB.query(params).promise();

    if (!Items || Items.length === 0) {
      return res.status(404).json({ message: "Questions not found" });
    }

    // Extract questions from all items (assuming each item has a questions array)
    res.status(200).json({ questions: Items });
  } catch (error) {
    console.error("Error fetching from DynamoDB:", error);
    res.status(500).json({ message: "Error fetching questions" });
  }
});

export default router;