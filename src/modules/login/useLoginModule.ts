import { useState } from 'react';
import { loginApi } from '../../api';
import { SessionUser } from '../../context/SessionContext';

export type LoginForm = {
  username: string;
  password: string;
};

const initialForm: LoginForm = {
  username: '',
  password: '',
};

export function useLoginModule() {
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [form, setForm] = useState<LoginForm>(initialForm);

  const login = async (onSuccess: (user: SessionUser) => void) => {
    if (!form.username.trim()) {
      setErrorText('Please enter your username.');
      return;
    }
    if (!form.password) {
      setErrorText('Please enter your password.');
      return;
    }

    setLoading(true);
    setErrorText('');
    try {
      const user = await loginApi(form.username.trim(), form.password);
      onSuccess(user);
    } catch (error) {
      setErrorText(String(error));
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setForm(initialForm);
    setErrorText('');
  };

  return {
    loading,
    errorText,
    form,
    setForm,
    login,
    reset,
  };
}
