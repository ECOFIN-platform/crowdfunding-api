const express = require("express");
const { dynamoDB, PROJECTS_TABLE } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 1. Création d’un projet de crowdfunding
router.post("/create", authMiddleware, async (req, res) => {
  const { title, description, goalAmount, deadline } = req.body;

  try {
    const newProject = {
      id: uuidv4(),
      userId: req.user.id,
      title,
      description,
      goalAmount,
      raisedAmount: 0,
      deadline,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: PROJECTS_TABLE,
      Item: newProject,
    }).promise();

    res.status(201).json({ message: "Projet créé avec succès", project: newProject });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 📌 2. Récupérer un projet spécifique
router.get("/:id", async (req, res) => {
  try {
    const result = await dynamoDB.get({
      TableName: PROJECTS_TABLE,
      Key: { id: req.params.id },
    }).promise();

    if (!result.Item) return res.status(404).json({ message: "Projet non trouvé" });

    res.json(result.Item);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 📌 3. Récupérer tous les projets
router.get("/", async (req, res) => {
  try {
    const result = await dynamoDB.scan({ TableName: PROJECTS_TABLE }).promise();
    res.json(result.Items);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 📌 4. Contribuer à un projet
router.post("/:id/fund", authMiddleware, async (req, res) => {
  const { amount } = req.body;
  const projectId = req.params.id;

  try {
    const result = await dynamoDB.get({
      TableName: PROJECTS_TABLE,
      Key: { id: projectId },
    }).promise();

    if (!result.Item) return res.status(404).json({ message: "Projet non trouvé" });

    const updatedAmount = result.Item.raisedAmount + amount;

    await dynamoDB.update({
      TableName: PROJECTS_TABLE,
      Key: { id: projectId },
      UpdateExpression: "set raisedAmount = :raisedAmount",
      ExpressionAttributeValues: {
        ":raisedAmount": updatedAmount,
      },
    }).promise();

    res.json({ message: "Contribution enregistrée", newRaisedAmount: updatedAmount });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

// 📌 5. Supprimer un projet
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await dynamoDB.delete({
      TableName: PROJECTS_TABLE,
      Key: { id: req.params.id },
    }).promise();

    res.json({ message: "Projet supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
