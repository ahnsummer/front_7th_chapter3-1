import React from "react";
import { Alert } from "@repo/after";

interface AlertSectionProps {
  showSuccess: boolean;
  showError: boolean;
  successMessage: string;
  errorMessage: string;
  onCloseSuccess: () => void;
  onCloseError: () => void;
}

export const AlertSection: React.FC<AlertSectionProps> = ({
  showSuccess,
  showError,
  successMessage,
  errorMessage,
  onCloseSuccess,
  onCloseError,
}) => {
  if (!showSuccess && !showError) return null;

  return (
    <div className="mb-2.5">
      {showSuccess && (
        <Alert variant="success" title="성공" onClose={onCloseSuccess}>
          {successMessage}
        </Alert>
      )}

      {showError && (
        <Alert variant="danger" title="오류" onClose={onCloseError}>
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};
