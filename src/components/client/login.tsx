import React, { useState } from "react";
import { auth, db, storage } from "../../firebase/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful! User:", user);

      await addDoc(collection(db, "users"), {
        userId: user.uid,
        email: user.email,
        lastLogin: new Date(),
      });

      const file = new File(["Hello, Firebase!"], "test.txt", { type: "text/plain" });
      const storageRef = ref(storage, `uploads/${file.name}`);
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
