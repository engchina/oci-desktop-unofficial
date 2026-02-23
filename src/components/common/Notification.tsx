import "./Notification.css";

interface NotificationProps {
  type: "success" | "error" | "info";
  message: string;
  onClose?: () => void;
}

export default function Notification({ type, message, onClose }: NotificationProps) {
  if (!message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <span className="notification-icon">
        {type === "success" && "✓"}
        {type === "error" && "✗"}
        {type === "info" && "ℹ"}
      </span>
      <span className="notification-message">{message}</span>
      {onClose && (
        <button className="notification-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
}
