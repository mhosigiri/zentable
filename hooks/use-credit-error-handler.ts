'use client';

import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function useCreditErrorHandler() {
  const { toast } = useToast();
  const router = useRouter();

  const handleApiResponse = async (response: Response) => {
    if (response.status === 402) {
      // Payment Required - Insufficient Credits
      const data = await response.json();
      
      toast({
        title: "Insufficient Credits",
        description: `You need ${data.creditsRequired || 'more'} credits but only have ${data.currentBalance || 0}. Please upgrade your plan to continue.`,
        variant: "destructive",
      });
      
      throw new Error(data.error || 'Insufficient credits');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }
    
    return response;
  };

  const fetchWithCreditHandling = async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      return await handleApiResponse(response);
    } catch (error) {
      // Re-throw to let the caller handle it
      throw error;
    }
  };

  return {
    handleApiResponse,
    fetchWithCreditHandling
  };
}