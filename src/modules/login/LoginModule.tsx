import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useSession } from '../../context/SessionContext';
import styles from '../../styles';
import { useLoginModule } from './useLoginModule';

type LoginModuleProps = {
  onLoginSuccess: () => void;
};

export function LoginModule({ onLoginSuccess }: LoginModuleProps) {
  const { setSession } = useSession();
  const { loading, errorText, form, setForm, login } = useLoginModule();

  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Welcome</Text>
      <Text style={styles.pageSubtitle}>Sign in to continue</Text>

      <View style={styles.formCard}>
        <TextInput
          style={styles.input}
          placeholder="Username"
          autoCapitalize="none"
          autoCorrect={false}
          value={form.username}
          onChangeText={value => setForm({ ...form, username: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          value={form.password}
          onChangeText={value => setForm({ ...form, password: value })}
        />

        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}

        <Pressable
          style={[styles.loginButton, loading && styles.loginButtonDisabled]}
          disabled={loading}
          onPress={() =>
            void login(user => {
              setSession(user);
              onLoginSuccess();
            })
          }>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
