import { toast } from "react-toastify";

// ✅ Success Toast — custom green background
export const showSuccessToast = (message) => {
  toast.success(message || "Successful!", {
    style: {
      backgroundColor: "#22c55e", // Tailwind green-500
      color: "#fff",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "12px 16px",
    },
    icon: "✅",
  });
};

// ❌ Error Toast — custom red background
export const showErrorToast = (message) => {
  toast.error(message || "An error occurred", {
    style: {
      backgroundColor: "#ef4444", // Tailwind red-500
      color: "#fff",
      fontWeight: "600",
      borderRadius: "8px",
      padding: "12px 16px",
    },
    icon: "❌",
  });
};
