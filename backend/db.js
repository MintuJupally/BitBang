var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

const db = admin.app().firestore();
const auth = admin.app().auth();

module.exports = { db, auth };
