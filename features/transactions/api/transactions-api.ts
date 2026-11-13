import type { ApiResponse } from "@/lib/api-client";
import { apiClient, HttpMethod } from "@/lib/api-client";
import type { CustomerTransaction } from "../types";

export const customerTransactionsApi = {
  async getMyTransactions(): Promise<ApiResponse<CustomerTransaction[]>> {
    return apiClient<CustomerTransaction[]>("/transactions/me", {
      method: HttpMethod.GET,
    });
  },

  async uploadPaymentProof(
    transactionId: string,
    file: File,
  ): Promise<ApiResponse<CustomerTransaction>> {
    const formData = new FormData();
    formData.append("image", file);

    return apiClient<CustomerTransaction>(`/transactions/${transactionId}/payment-proof`, {
      method: HttpMethod.POST,
      body: formData,
    });
  },

  async cancelTransaction(transactionId: string): Promise<ApiResponse<CustomerTransaction>> {
    return apiClient<CustomerTransaction>(`/transactions/${transactionId}/cancel`, {
      method: HttpMethod.POST,
    });
  },
};
