import React, { useState } from "react";
import { auth } from "../../firebase/firebaseConfig"; // นำเข้า auth จาก firebaseConfig
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();  

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful! User:", user);
      
      // หลังจากล็อกอินสำเร็จ, นำทางไปยังหน้า /admin/testbook
      router.push("/admin/testbook"); 
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
