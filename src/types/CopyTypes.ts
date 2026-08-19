export type CopyMethod = "clipboard" | "execCommand";

export type CopyResult =
  | {
      success: true;
      method: CopyMethod;
    }
  | {
      success: false;
      error?: unknown;
    };

export type CopyOptions = {
  debug?: boolean;
  message?: string;
  format?: string;
  onCopy?: (result: CopyResult) => void;
  onSuccess?: () => void;
  onFailed?: () => void;
};

export type CopyableProps = CopyOptions & {
  value: string;
  timeout?: number;
};
