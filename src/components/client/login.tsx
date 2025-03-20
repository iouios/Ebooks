import React, { useState } from "react";
import { auth, db, storage } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful! User:", user);

      // 🔹 ใช้ setDoc เพื่ออัปเดตข้อมูลผู้ใช้แทน addDoc
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        lastLogin: new Date(),
      }, { merge: true });

      // 🔹 สร้าง path ของไฟล์ให้แยกตาม userId
      const file = new File(["Hello, Firebase!"], "test.txt", { type: "text/plain" });
      const storageRef = ref(storage, `uploads/${user.uid}/test.txt`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      console.log("File uploaded! URL:", downloadURL);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
