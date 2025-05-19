import { useCallback } from "react";
import { toast as sonner } from "sonner"; // If you're using `sonner`, otherwise adapt as needed

export function useToast() {
  return useCallback(
    ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
      sonner(title, { description });
    },
    []
  );
}

export const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
  // Fallback if not using sonner
  alert(`${title}\n\n${description}`);
};
