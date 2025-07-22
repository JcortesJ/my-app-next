import Toast from "./Toast";
import { ToastNotification } from "@/hooks/useToast";
import styles from "./ToastContainer.module.css";

interface ToastContainerProps {
  toasts: ToastNotification[];
  onRemoveToast: (id: string) => void;
}

export default function ToastContainer({
  toasts,
  onRemoveToast,
}: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className={styles.toastContainer}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={styles.toastWrapper}
          style={
            {
              "--toast-index": index,
              zIndex: 1000 - index,
            } as React.CSSProperties
          }
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => onRemoveToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
}
