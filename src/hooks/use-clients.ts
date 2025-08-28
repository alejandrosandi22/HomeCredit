import { CreateClientData, UpdateClientData } from '@/lib/validations/client';
import { ApplicationsFinal } from '@/types';
import { useEffect, useState } from 'react';

interface UseClientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface ClientsResponse {
  clients: ApplicationsFinal[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseClientsReturn {
  clients: ApplicationsFinal[];
  pagination: ClientsResponse['pagination'] | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClients({
  page = 1,
  limit = 10,
  search = '',
}: UseClientsParams = {}): UseClientsReturn {
  const [data, setData] = useState<ClientsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/clients?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch clients');
      }

      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [page, limit, search]);

  return {
    clients: data?.clients || [],
    pagination: data?.pagination || null,
    loading,
    error,
    refetch: fetchClients,
  };
}

interface UseClientReturn {
  client: ApplicationsFinal | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useClient(id: number): UseClientReturn {
  const [client, setClient] = useState<ApplicationsFinal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/clients/${id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch client');
      }

      setClient(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchClient();
    }
  }, [id]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient,
  };
}

interface UseClientMutationsReturn {
  createClient: (data: CreateClientData) => Promise<void>;
  updateClient: (id: number, data: UpdateClientData) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export function useClientMutations(): UseClientMutationsReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createClient = async (data: CreateClientData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to create client');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: number, data: UpdateClientData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to update client');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteClient = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to delete client');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createClient,
    updateClient,
    deleteClient,
    loading,
    error,
  };
}
