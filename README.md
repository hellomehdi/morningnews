# morningnews
A first MERN Stack project to try out Redux. Final result at https://usemorningnews.herokuapp.com

# Comment mettre en ligne sur Heroku
## 1) Fichier .env
* Installer le package dotenv (**npm i dotenv**) dans le backend.
* Ajouter **require("dotenv").config();** au début de app.js dans le backend.
* Créer un fichier .env dans le backend
* Dans ce fichier .env, ajouter **MONGODB_URI=votreURLdeConnexionMongoDB**
* Dans votre fichier de connexion à la BDD, remplacez l'URL de connexion MongoDB par **process.env.MONGODB_URI**
* Dans *.gitignore*, ajouter sur une ligne **.env**

## 2) Préparer les fichiers front et back
* Dans app.js (backend) enlever : **app.use(express.static(path.join(__dirname, 'public')));**
* Et mettre : **app.use(express.static(path.join(__dirname, 'client/build')));**
* Dans le package.json du backend ajouter la ligne **"heroku-postbuild": "cd client && npm install && npm run build"** (cf mon package.json)
(*client* est le nom du fichier où il y a les fichiers React)

## 3) Mise en ligne
* Créer le project sur heroku
* Installer le module mLab sur Heroku
* Normalement c'est bon.

La base de données n'est plus celle qu'on a crée, mais une autre créée par Heroku.
