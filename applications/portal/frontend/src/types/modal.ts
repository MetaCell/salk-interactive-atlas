export interface Modal {
  open: boolean;
  title: string;
  actionText?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl"
  handleClose: () => void;
  handleAction?: () => void;
  disableGutter?: boolean;
  dialogActions?: boolean;
};

