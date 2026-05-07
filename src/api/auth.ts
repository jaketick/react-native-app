import { SessionUser } from '../context/SessionContext';
import { apiClient } from './client';

type LoginResponse = {
    success: boolean;
    message?: string;
    error?: string;
    empid?: number | string;
    employee_id?: number | string;
    empId?: number | string;
    id?: number | string;
    data?: Record<string, unknown> | unknown[];
};

type LogoutResponse = {
    success: boolean;
    message?: string;
    error?: string;
};

function normalizeSessionUser(data: Record<string, unknown>): SessionUser {
    const rawEmpid = data.empid ?? data.employee_id ?? data.empId ?? data.id;

    const parsedEmpid =
        typeof rawEmpid === 'number'
            ? rawEmpid
            : typeof rawEmpid === 'string'
              ? Number(rawEmpid)
              : NaN;

    if (!Number.isFinite(parsedEmpid)) {
        throw new Error('Login response is missing empid');
    }

    return {
        empid: parsedEmpid,
    };
}

export async function loginApi(username: string, password: string): Promise<SessionUser> {
    const res = await apiClient.post<LoginResponse>('/user_login.php', { username, password });
    if (!res.success) {
        throw new Error(res.error ?? res.message ?? 'Login failed');
    }

    const payload = Array.isArray(res.data)
        ? {
            empid: res.empid ?? res.employee_id ?? res.empId ?? res.id,
        }
        : {
            ...res,
            ...(res.data ?? {}),
        };

    return normalizeSessionUser(payload);
}

export async function logoutApi(): Promise<void> {
    const res = await apiClient.post<LogoutResponse>('/user_logout.php', {});
    if (!res.success) {
        throw new Error(res.error ?? res.message ?? 'Logout failed');
    }
}
