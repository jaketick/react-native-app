import { apiClient } from './client';

export type UserDetailRow = Record<string, unknown> & {
  id?: number | string;
};

export type PileAllRow = Record<string, unknown> & {
  id?: number | string;
};

type ListResponse<T> = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T[];
};

function normalizeRows<T>(payload: ListResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  throw new Error(payload.error ?? payload.message ?? 'Failed to load user details');
}

export async function listUserDetails(empid: number): Promise<UserDetailRow[]> {
  const res = await apiClient.get<ListResponse<UserDetailRow> | UserDetailRow[]>(
    `/joblist.php?empid=${empid}`,
  );
  return normalizeRows(res);
}

export async function listPileAll(jobId: number | string): Promise<PileAllRow[]> {
  const encodedJobId = encodeURIComponent(String(jobId));
  const res = await apiClient.get<ListResponse<PileAllRow> | PileAllRow[]>(
    `/pileall.php?job_id=${encodedJobId}`,
  );
  return normalizeRows(res);
}