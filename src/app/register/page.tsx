"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase-client";
import { useAppSelector } from "@/store/hooks";

// Helper function to check nickname uniqueness
async function isNicknameUnique(nickname: string): Promise<boolean> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("nickname", "==", nickname));
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
}

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const onboardingCompleted = useAppSelector(
    (state) => state.onboarding.hasCompleted
  );

  const gameState = useAppSelector((state) => state.game);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // --- Validation ---
    if (password !== confirmPassword) {
      setError("Пароли не совпадают.");
      return;
    }
    if (nickname.length < 3) {
      setError("Никнейм должен содержать не менее 3 символов.");
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
      setError(
        "Никнейм может содержать только буквы, цифры и нижнее подчеркивание."
      );
      return;
    }

    setIsLoading(true);

    try {
      const isUnique = await isNicknameUnique(nickname);
      if (!isUnique) {
        setError("Этот никнейм уже занят.");
        setIsLoading(false);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        nickname: nickname, // <-- Add nickname
        createdAt: serverTimestamp(),
        gameState: gameState,
      });

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        // Firebase error messages are often not user-friendly
        if (err.message.includes("auth/email-already-in-use")) {
          setError("Этот email уже зарегистрирован.");
        } else if (err.message.includes("auth/weak-password")) {
          setError("Пароль слишком слабый. Используйте не менее 6 символов.");
        } else {
          setError("Произошла ошибка при регистрации.");
        }
        console.error("Registration error:", err.message);
      } else {
        setError("Произошла неизвестная ошибка.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!onboardingCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold mb-4">Регистрация пока недоступна</h2>
        <p className="mb-6">
          Пожалуйста, пройдите обучение в игре, чтобы открыть возможность
          регистрации.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Вернуться на главную
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen text-gray-700">
      <div className="w-full max-w-md p-8 space-y-6 rounded-lg bg-white shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-900">
          Создать аккаунт
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="nickname"
              className="text-sm font-medium text-gray-700"
            >
              Никнейм
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Your_Nickname"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Пароль
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500"
            >
              <Image
                src={showPassword ? "eye/eye-closed.svg" : "eye/eye-open.svg"}
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </button>
          </div>
          <div className="relative">
            <label
              htmlFor="confirm-password"
              className="text-sm font-medium text-gray-700"
            >
              Подтвердите пароль
            </label>
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-gray-500"
            >
              <Image
                src={
                  showConfirmPassword
                    ? "eye/eye-closed.svg"
                    : "eye/eye-open.svg"
                }
                alt="Toggle password visibility"
                width={20}
                height={20}
              />
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:bg-gray-400"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Уже есть аккаунт?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
