import { db } from "../firebase/config";
    import { doc, setDoc, getDoc } from "firebase/firestore";

// Save user profile
export const saveUserProfile = async (uid: string, name: string, age: number, profileImage?: string) => {
  try {
    await setDoc(doc(db, "users", uid), {
      name,
      age,
      profileImage: profileImage || "",
      createdAt: new Date(),
    }, { merge: true }); // Merge prevents overwriting existing fields
    console.log("User Profile Saved!");
  } catch (error) {
    console.error("Error saving profile:", error);
  }
};

// Get user profile
export const getUserProfile = async (uid: string) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};
