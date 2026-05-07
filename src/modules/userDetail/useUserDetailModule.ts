import { useCallback, useEffect, useMemo, useState } from 'react';
import { listUserDetails } from '../../api';
import { useSession } from '../../context/SessionContext';
import { UserDetailRow } from '../../api/userDetails';

function isPrimitiveValue(value: unknown) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

export function useUserDetailModule() {
  const { session } = useSession();
  const [listLoading, setListLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [rows, setRows] = useState<UserDetailRow[]>([]);

  const loadUserDetails = useCallback(async () => {
    if (session?.empid == null) {
      setRows([]);
      setErrorText('Session not found. Please login again.');
      return;
    }

    setListLoading(true);
    setErrorText('');
    try {
      const data = await listUserDetails(session.empid);
      setRows(data);
    } catch (error) {
      setErrorText(String(error));
    } finally {
      setListLoading(false);
    }
  }, [session?.empid]);

  useEffect(() => {
    void loadUserDetails();
  }, [loadUserDetails]);

  const columns = useMemo(() => {
    const firstRow = rows[0];
    if (!firstRow) {
      return [];
    }

    return Object.keys(firstRow).filter(key => isPrimitiveValue(firstRow[key]));
  }, [rows]);

  return {
    empid: session?.empid ?? null,
    listLoading,
    errorText,
    columns,
    rows,
    loadUserDetails,
  };
}