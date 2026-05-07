import { Pressable, Text, View } from 'react-native';
import styles from '../styles';

type ModuleHeaderProps = {
  title: string;
  onBack: () => void;
  onRightAction: () => void;
  rightActionLabel?: string;
};

export function ModuleHeader({ title, onBack, onRightAction, rightActionLabel = 'List' }: ModuleHeaderProps) {
  return (
    <View style={styles.moduleHeaderRow}>
      <Pressable style={styles.secondaryButton} onPress={onBack}>
        <Text style={styles.secondaryButtonText}>Back</Text>
      </Pressable>
      <Text style={styles.moduleTitle}>{title}</Text>
      <Pressable style={styles.secondaryButton} onPress={onRightAction}>
        <Text style={styles.secondaryButtonText}>{rightActionLabel}</Text>
      </Pressable>
    </View>
  );
}
