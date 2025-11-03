"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  doc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase-client";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import AdminPanel from "@/components/admin/AdminPanel";

// Helper function to check nickname uniqueness
async function isNicknameUnique(nickname: string): Promise<boolean> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("nickname", "==", nickname));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

interface UserData {
  nickname?: string;
  email?: string;
  role?: "admin" | "user";
  gameState?: {
    turn: number;
    netWorthHistory: { week: number; netWorth: number }[];
  };
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  // State for editing
  const [newNickname, setNewNickname] = useState("");
  const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsFetching(true);
      return;
    }
    if (!user) {
      setIsFetching(false);
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const unsubscribe = onSnapshot(
        userDocRef,
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data() as UserData;
            setUserData(data);
            setNewNickname(data.nickname || "");
          } else {
            console.log("No such document!");
          }
          setIsFetching(false);
        },
        (error) => {
          console.error("Error fetching user data:", error);
          setIsFetching(false);
        }
      );

      return () => unsubscribe();
    }
  }, [user]);

  const handleUpdateNickname = async () => {
    setMessage(null);
    if (newNickname.length < 3) {
      setMessage({
        type: "error",
        text: "Никнейм должен содержать не менее 3 символов.",
      });
      return;
    }
    if (newNickname === userData?.nickname) {
      setMessage({ type: "error", text: "Новый никнейм совпадает с текущим." });
      return;
    }

    setIsUpdatingNickname(true);
    try {
      const isUnique = await isNicknameUnique(newNickname);
      if (!isUnique) {
        setMessage({ type: "error", text: "Этот никнейм уже занят." });
        return;
      }

      const userDocRef = doc(db, "users", user!.uid);
      await updateDoc(userDocRef, { nickname: newNickname });
      setUserData((prevData) => ({ ...prevData, nickname: newNickname }));
      setMessage({ type: "success", text: "Никнейм успешно обновлен!" });
    } catch (error) {
      setMessage({ type: "error", text: "Ошибка при обновлении никнейма." });
      console.error("Error updating nickname:", error);
    } finally {
      setIsUpdatingNickname(false);
    }
  };

  const handlePasswordReset = async () => {
    setMessage(null);
    if (user?.email) {
      try {
        await sendPasswordResetEmail(auth, user.email);
        setMessage({
          type: "success",
          text: `Письмо для сброса пароля отправлено на ${user.email}`,
        });
      } catch (error) {
        setMessage({
          type: "error",
          text: "Не удалось отправить письмо для сброса пароля.",
        });
        console.error("Password reset error:", error);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      router.push("/");
    } catch (error) {
      setMessage({
        type: "error",
        text: "Ошибка при удалении аккаунта. Пожалуйста, войдите в систему заново и попробуйте еще раз.",
      });
      console.error("Account deletion error:", error);
    }
  };

  if (isFetching || loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-center">
        <p>Загрузка...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 p-4 sm:p-6 flex justify-center items-center">
        <p>Пожалуйста, войдите, чтобы увидеть свой профиль.</p>
      </main>
    );
  }

  const currentNetWorth =
    userData?.gameState?.netWorthHistory?.slice(-1)[0]?.netWorth ?? 0;

  return (
    <>
      <main className="p-4 sm:p-6 flex flex-col items-center">
        <div className="w-full max-w-6xl rounded-xl shadow-lg p-6 sm:p-8 bg-plashka">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
            Профиль
          </h1>

          {/* --- Main Information --- */}
          <div className="space-y-4 border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-white">
              Основная информация
            </h2>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Никнейм:</span>
              <span className="font-bold text-lg text-gray-900">
                {userData?.nickname || "Не указан"}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-800">{userData?.email}</span>
            </div>
          </div>

          {/* --- Game Statistics --- */}
          <div className="space-y-4 border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-white">
              Игровая статистика
            </h2>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Текущая неделя:</span>
              <span className="font-bold text-lg text-gray-900">
                {userData?.gameState?.turn ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">Капитал:</span>
              <span className="font-bold text-lg text-gray-900">
                ₽{currentNetWorth.toLocaleString()}
              </span>
            </div>
          </div>

          {/* --- Account Management --- */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Управление аккаунтом
            </h2>

            {/* Change Nickname */}
            <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
              <label
                htmlFor="nickname-input"
                className="block font-medium text-gray-600 mb-2">
                Сменить никнейм
              </label>
              <div className="flex items-center gap-4">
                <input
                  id="nickname-input"
                  type="text"
                  value={newNickname}
                  onChange={(e) => setNewNickname(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  onClick={handleUpdateNickname}
                  disabled={isUpdatingNickname}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400 whitespace-nowrap">
                  {isUpdatingNickname ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>

            {/* Password Reset */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-600">Сбросить пароль</span>
              <button
                onClick={handlePasswordReset}
                className="text-blue-600 hover:underline">
                Отправить письмо
              </button>
            </div>

            {/* Delete Account */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-red-600">
                Опасная зона
              </h3>
              <div className="mt-2 flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="max-w-sm">
                  <span className="font-medium text-red-700">
                    Удалить аккаунт
                  </span>
                  <p className="text-sm text-gray-500 mt-1">
                    Это действие необратимо. Все ваши данные, включая игровой
                    прогресс, будут удалены навсегда.
                  </p>
                </div>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md shadow-sm whitespace-nowrap">
                  Удалить
                </button>
              </div>
            </div>
          </div>

          {message && (
            <div
              className={`mt-6 p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}>
              {message.text}
            </div>
          )}
        </div>

        {/* Conditionally render Admin Panel */}
        {userData?.role === "admin" && <AdminPanel />}
      </main>

      {/* --- Delete Confirmation Modal --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 m-4 max-w-sm w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Вы уверены?
            </h2>
            <p className="text-gray-600 mb-6">
              Это действие приведет к полному удалению вашего аккаунта и всех
              связанных с ним данных. Отменить это будет невозможно.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-md">
                Отмена
              </button>
              <button
                onClick={handleDeleteAccount}
                className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md">
                Да, удалить аккаунт
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}