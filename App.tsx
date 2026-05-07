import { useState } from 'react';
import { Alert, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SessionProvider, useSession } from './src/context/SessionContext';
import { LoginModule } from './src/modules/login/LoginModule';
import { UserDetailModule } from './src/modules/userDetail/UserDetailModule';
import { ROUTES, ScreenRoute } from './src/navigation/routes';
import { MenuScreen } from './src/screens/MenuScreen';
import styles from './src/styles';

function AppNavigator() {
  const { session, setSession } = useSession();
  const [route, setRoute] = useState<ScreenRoute>(ROUTES.MENU);

  if (!session) {
    return <LoginModule onLoginSuccess={() => setRoute(ROUTES.USER_DETAIL)} />;
  }

  const onLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          setSession(null);
          setRoute(ROUTES.LOGIN);
        },
      },
    ]);
  };

  return (
    <View style={styles.appShell}>
      <View style={styles.globalTopBar}>
        <Text style={styles.globalTopBarText}>EMPID: {session.empid}</Text>
        <Pressable style={styles.globalLogoutButton} onPress={onLogout}>
          <Text style={styles.globalLogoutButtonText}>Logout</Text>
        </Pressable>
      </View>

      <View style={styles.appContent}>
        {route === ROUTES.MENU && <MenuScreen onNavigate={setRoute} />}
        {route === ROUTES.USER_DETAIL && <UserDetailModule onBack={() => setRoute(ROUTES.MENU)} />}
      </View>
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <SessionProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <StatusBar barStyle="dark-content" backgroundColor="#F6F8FB" />
          <AppNavigator />
        </SafeAreaView>
      </SessionProvider>
    </SafeAreaProvider>
  );
}

export default App;
