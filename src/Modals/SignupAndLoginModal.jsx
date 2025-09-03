import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AuthService from "../services/authServices";
import OTPModal from "./OTPModal";
import { useNavigate } from "react-router-dom";
import { setUser } from "../ReduxStore/Reducers";
import { useDispatch } from "react-redux";

const AuthModal = ({ isOpen, onClose, type }) => {
  const [currentType, setCurrentType] = useState(type);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);
  const [userIdForOTP, setUserIdForOTP] = useState("");
  const [emailForOTP, setEmailForOTP] = useState("");
  const [isResending, setIsResending] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (currentType === "signup") {
        const result = await AuthService.register({ name, email, password });
        setUserIdForOTP(result.userId);
        setEmailForOTP(email);
        setIsOTPModalOpen(true);
      } else {
        const result = await AuthService.login({ email, password });

        if (result.requiresVerification) {
          setUserIdForOTP(result.userId);
          setEmailForOTP(email);
          setIsOTPModalOpen(true);
        } else {
          dispatch(setUser({ user: result.user, token: result.token }));

          AuthService.saveToken(result.token);
          AuthService.saveUser(result.user);
          localStorage.setItem("token", result.token);
          localStorage.setItem("user", JSON.stringify(result.user));

          onClose();
          navigate("/todo");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerify = async (otpCode) => {
    try {
      const result = await AuthService.verifyEmail(userIdForOTP, otpCode);

      dispatch(setUser({ user: result.user, token: result.token }));

      AuthService.saveToken(result.token);
      AuthService.saveUser(result.user);
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      setIsOTPModalOpen(false);
      onClose();
      navigate("/todo");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await AuthService.resendOTP(userIdForOTP);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const modal = {
    hidden: { scale: 0.8, opacity: 0, y: -50 },
    visible: { scale: 1, opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { scale: 0.8, opacity: 0, y: 50 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
          variants={backdrop}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="w-[380px] p-6 rounded-2xl shadow-2xl relative bg-green-100 bg-opacity-80 backdrop-blur-md"
            variants={modal}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-gray-700 hover:text-gray-900 transition"
              onClick={onClose}
            >
              <X size={20} />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              {currentType === "signin" ? "Sign In" : "Sign Up"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              {currentType === "signup" && (
                <motion.input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full p-2 border rounded"
                  required
                />
              )}

              <motion.input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <motion.input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full p-2 border rounded"
                required
              />

              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 rounded-lg font-semibold bg-white text-gray-900 hover:bg-gray-200 disabled:bg-gray-300"
              >
                {isLoading
                  ? currentType === "signin"
                    ? "Signing In..."
                    : "Signing Up..."
                  : currentType === "signin"
                  ? "Sign In"
                  : "Sign Up"}
              </motion.button>
            </form>

            <p
              className="text-center text-sm text-gray-700 mt-3 cursor-pointer hover:underline"
              onClick={() =>
                setCurrentType(currentType === "signin" ? "signup" : "signin")
              }
            >
              {currentType === "signin"
                ? "Don't have an account? Sign Up"
                : "Already have an account? Sign In"}
            </p>
          </motion.div>
          <OTPModal
            isOpen={isOTPModalOpen}
            onClose={() => setIsOTPModalOpen(false)}
            onVerify={handleOTPVerify}
            onResendOTP={handleResendOTP}
            email={emailForOTP}
            isResending={isResending}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
