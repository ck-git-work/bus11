// net.js: the only file that talks to the shared database (Firebase Realtime Database).
// Phones and the scoreboard both use it. The config below is public by design
// (Firebase's own docs say so); access is controlled by the database rules.

export const firebaseConfig = {
  apiKey: "AIzaSyAHGLmWVAllNAWpgCCu9PV-PnxT-tE9s8Y",
  authDomain: "bus11-games.firebaseapp.com",
  databaseURL: "https://bus11-games-default-rtdb.firebaseio.com",
  projectId: "bus11-games",
  storageBucket: "bus11-games.firebasestorage.app",
  messagingSenderId: "952437912345",
  appId: "1:952437912345:web:0cb1b770366ae090fd0b88",
};

export const ROOT = "insurance"; // the one folder the database rules open up
const SDK = "https://www.gstatic.com/firebasejs/13.3.0";

// Loads the Firebase library and returns a small set of functions.
// Paths are relative to ROOT, for example "games/abc/meta".
export async function connect() {
  const [appMod, db] = await Promise.all([import(`${SDK}/firebase-app.js`), import(`${SDK}/firebase-database.js`)]);
  const app = appMod.initializeApp(firebaseConfig);
  const database = db.getDatabase(app);
  const at = (path) => db.ref(database, path ? `${ROOT}/${path}` : ROOT);
  return {
    // Calls cb with the value now and again every time it changes. Returns a function that stops listening.
    on: (path, cb) => db.onValue(at(path), (snap) => cb(snap.val())),
    get: async (path) => (await db.get(at(path))).val(),
    set: (path, value) => db.set(at(path), value),
    update: (path, value) => db.update(at(path), value),
    remove: (path) => db.remove(at(path)),
    // Tells the page whether it is currently connected to the database.
    onConnection: (cb) => db.onValue(db.ref(database, ".info/connected"), (snap) => cb(!!snap.val())),
  };
}

export function randomId(n = 10) {
  const abc = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  const buf = new Uint32Array(n);
  crypto.getRandomValues(buf);
  for (let i = 0; i < n; i++) s += abc[buf[i] % abc.length];
  return s;
}

export async function sha256(text) {
  const bytes = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
