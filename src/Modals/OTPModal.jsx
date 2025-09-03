import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, RefreshCw } from "lucide-react";

const OTPModal = ({ isOpen, onClose, onVerify, onResendOTP, email, isResending }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimer(300);
      setCanResend(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      alert("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    await onVerify(otpCode);
    setIsLoading(false);
  };

  const handleResend = async () => {
    if (!canResend || isResending) return;
    
    await onResendOTP();
    setTimer(300);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
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
            className="w-[420px] p-6 rounded-2xl shadow-2xl relative bg-blue-50 bg-opacity-80 backdrop-blur-md"
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              Verify Email
            </h2>
            <p className="text-gray-600 text-center mb-6">
              We've sent a 6-digit code to <br />
              <span className="font-medium">{email}</span>
            </p>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-600">
                    Code expires in {formatTime(timer)}
                  </p>
                ) : (
                  <p className="text-red-500">Code expired</p>
                )}
              </div>

              {/* Verify Button */}
              <motion.button
                type="submit"
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full py-3 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </motion.button>

              {/* Resend Button */}
              <button
                type="button"
                onClick={handleResend}
                disabled={!canResend || isResending}
                className="w-full py-2 text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
              >
                <RefreshCw 
                  size={16} 
                  className={isResending ? "animate-spin" : ""} 
                />
                <span>
                  {isResending 
                    ? "Sending..." 
                    : canResend 
                      ? "Resend Code" 
                      : `Resend in ${formatTime(timer)}`
                  }
                </span>
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal;