import { Pressable, Text, View } from 'react-native';
import { ROUTES, ScreenRoute } from '../navigation/routes';
import styles from '../styles';

type MenuScreenProps = {
  onNavigate: (route: ScreenRoute) => void;
};

export function MenuScreen({ onNavigate }: MenuScreenProps) {
  return (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Data Modules</Text>
      <Text style={styles.pageSubtitle}>Choose a module to manage records</Text>

      <View style={styles.menuCard}>
        <Pressable style={styles.menuButton} onPress={() => onNavigate(ROUTES.USER_DETAIL)}>
          <Text style={styles.menuButtonTitle}>User Detail</Text>
          <Text style={styles.menuButtonSubtitle}>job list by current session empid</Text>
        </Pressable>
      </View>
    </View>
  );
}
