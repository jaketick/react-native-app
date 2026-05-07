import { Pressable, Text, View } from 'react-native';
import styles from '../styles';
import { EntityListRow } from '../types';

type EntityListProps = {
  title: string;
  rows: EntityListRow[];
};

export function EntityList({ title, rows }: EntityListProps) {
  return (
    <View style={styles.listCard}>
      <Text style={styles.listTitle}>{title} List</Text>
      {rows.length === 0 ? (
        <Text style={styles.emptyText}>No data</Text>
      ) : (
        rows.map(row => (
          <View key={row.key} style={styles.listRowCard}>
            <View style={styles.listTextWrap}>
              <Text style={styles.listRowTitle}>{row.title}</Text>
              <Text style={styles.listRowSubtitle}>{row.subtitle}</Text>
            </View>
            <View style={styles.listActions}>
              <Pressable style={styles.smallActionButton} onPress={row.onEdit}>
                <Text style={styles.smallActionText}>Edit</Text>
              </Pressable>
              <Pressable style={styles.smallDeleteButton} onPress={row.onDelete}>
                <Text style={styles.smallActionText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
