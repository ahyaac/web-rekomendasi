import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  // cek login saat reload
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/v1/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data); // data berisi {id, username}
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
