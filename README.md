# crowdfunding-api
Une implémentation Node.js (Express.js) des APIs de Crowdfunding et Gestion des Projets, optimisée pour un déploiement sur AWS avec Amazon DynamoDB comme base de données.

# Avant d’exécuter le code, installez les dépendances nécessaires :

npm init -y
npm install express aws-sdk dotenv uuid cors helmet morgan

# Déploiement
npm install -g serverless
serverless deploy
