import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to handle API errors
export function handleApiError(error: any): string {
  if (error && typeof error === 'object') {
    if ('response' in error) {
      const axiosError = error as any;
      return axiosError.response?.data?.message ||
             axiosError.response?.data?.error?.message ||
             axiosError.message ||
             "API request failed";
    } else if ('message' in error) {
      return (error as any).message;
    }
  }
  return "Something went wrong";
}

// Utility function to validate image URLs
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}
