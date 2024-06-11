// src/hooks/useCamareroInfo.ts
import { useState, useEffect } from "react";
import { fetchUserById } from "../services/userService";

interface UserInfo {
  name: string;
  surname: string;
}

const useCamareroInfo = (camareroId: string) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await fetchUserById(camareroId);
        setUserInfo({ name: user.name, surname: user.surname });
      } catch (error) {
        console.error(
          `Error fetching user for camarero_id ${camareroId}:`,
          error
        );
      }
    };

    if (camareroId) {
      fetchUserInfo();
    }
  }, [camareroId]);

  return { userInfo };
};

export default useCamareroInfo;
