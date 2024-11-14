"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getUserEmail,
  getToken,
} from "@/services/storageService";

export const useAuth = () => {
  const [userEmail, setUserEmail] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = getToken(); // Get token from sessionStorage

      if (!token) {
        router.push("/login");
        return;
      }
    };

    checkAuth();
  }, [router]);

  return { userEmail };
};
