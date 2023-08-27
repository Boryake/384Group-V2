import React, { useState, useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  useEffect(() => {
    const handleClose = () => {
      setShow(false);

      const transitionDuration = 500;

      setTimeout(() => {
        onClose();
      }, transitionDuration);
    };

    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  const notificationClassName = `notification ${type} ${show ? "show" : ""}`;

  return (
    <div className={notificationClassName}>
      <p>{message}</p>
    </div>
  );
};

export default Notification;
