import { db, auth } from "./firebase-config.js";
import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// FAKE USER for local testing
const fakeUser = {
  uid: "test-user-001"
};

// Forcefully set fake user if none is logged in
auth.onAuthStateChanged((user) => {
  if (!user) {
    console.warn("⚠️ No user logged in. Using fake test user.");
    auth.currentUser = fakeUser;
    loadSchedule(fakeUser);
  } else {
    loadSchedule(user);
  }
});

// Load campaign schedule
async function loadSchedule(user) {
  const userId = user.uid;
  const docRef = doc(db, "adSchedules", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("campaignName").value = data.campaignName || "";
    document.getElementById("budget").value = data.budget || "";
    document.getElementById("schedule").value = data.schedule || "";
    document.getElementById("autorun").checked = data.autorun || false;
  } else {
    console.log("No saved schedule. You're fresh here.");
  }
}

// Save button click
document.getElementById("saveBtn").addEventListener("click", async () => {
  const user = auth.currentUser || fakeUser;

  const campaignData = {
    campaignName: document.getElementById("campaignName").value,
    budget: document.getElementById("budget").value,
    schedule: document.getElementById("schedule").value,
    autorun: document.getElementById("autorun").checked,
  };

  const docRef = doc(db, "adSchedules", user.uid);
  await setDoc(docRef, campaignData);
  alert("✅ Schedule saved successfully!");
});
