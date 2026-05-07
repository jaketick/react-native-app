import { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { listPileAll } from '../../api';
import { ModuleHeader } from '../../components/ModuleHeader';
import styles from '../../styles';
import { PileAllRow, UserDetailRow } from '../../api/userDetails';
import { useUserDetailModule } from './useUserDetailModule';

type UserDetailModuleProps = {
  onBack: () => void;
};

function formatCellValue(value: unknown) {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  return String(value);
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getIsStaffValue(row: UserDetailRow): number | null {
  const match = Object.entries(row).find(([key]) => {
    const normalized = key.toLowerCase();
    return normalized === 'is_staff' || normalized === 'isstaff';
  });

  if (!match) {
    return null;
  }

  return parseNumber(match[1]);
}

function isPrimitiveValue(value: unknown) {
  return value === null || ['string', 'number', 'boolean'].includes(typeof value);
}

function getJobIdValue(row: UserDetailRow): number | string | null {
  const rawJobId = row.job_id ?? row.jobId ?? row.jobid ?? row.id;
  if (typeof rawJobId === 'number' || typeof rawJobId === 'string') {
    return rawJobId;
  }
  return null;
}

export function UserDetailModule({ onBack }: UserDetailModuleProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'staffOnly'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [pileLoading, setPileLoading] = useState(false);
  const [pileErrorText, setPileErrorText] = useState('');
  const [pileRows, setPileRows] = useState<PileAllRow[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<number | string | null>(null);
  const { empid, listLoading, errorText, columns, rows, loadUserDetails } = useUserDetailModule();

  const visibleColumns = useMemo(
    () => columns.filter(column => !['is_staff', 'isstaff'].includes(column.toLowerCase())),
    [columns],
  );

  const filteredRows = useMemo(() => {
    if (filterMode === 'all') {
      return rows;
    }
    return rows.filter(row => {
      const isStaff = getIsStaffValue(row);
      return isStaff !== null && isStaff > 0;
    });
  }, [filterMode, rows]);

  const pileColumns = useMemo(() => {
    const firstRow = pileRows[0];
    if (!firstRow) {
      return [];
    }
    return Object.keys(firstRow).filter(key => isPrimitiveValue(firstRow[key]));
  }, [pileRows]);

  const closeModal = () => {
    setModalVisible(false);
    setPileRows([]);
    setPileErrorText('');
    setSelectedJobId(null);
  };

  const handleView = async (row: UserDetailRow) => {
    const jobId = getJobIdValue(row);
    if (jobId === null) {
      Alert.alert('User Detail', 'job_id not found in this row');
      return;
    }

    setModalVisible(true);
    setSelectedJobId(jobId);
    setPileLoading(true);
    setPileErrorText('');
    setPileRows([]);

    try {
      const data = await listPileAll(jobId);
      setPileRows(data);
    } catch (error) {
      setPileErrorText(String(error));
    } finally {
      setPileLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.moduleContainer}>
      <ModuleHeader
        title="User Detail"
        onBack={onBack}
        onRightAction={() => {
          void loadUserDetails();
        }}
        rightActionLabel="Refresh"
      />

      <View style={styles.listCard}>
        <Text style={styles.listTitle}>Job List for EMPID {empid ?? '-'}</Text>

        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterButton, filterMode === 'all' && styles.filterButtonActive]}
            onPress={() => setFilterMode('all')}>
            <Text
              style={[styles.filterButtonText, filterMode === 'all' && styles.filterButtonTextActive]}>
              Show all
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filterMode === 'staffOnly' && styles.filterButtonActive]}
            onPress={() => setFilterMode('staffOnly')}>
            <Text
              style={[
                styles.filterButtonText,
                filterMode === 'staffOnly' && styles.filterButtonTextActive,
              ]}>
              Show is staff only
            </Text>
          </Pressable>
        </View>

        {errorText ? <Text style={styles.errorText}>{errorText}</Text> : null}
        {listLoading ? <ActivityIndicator style={styles.loader} size="large" color="#0B6BFF" /> : null}

        {!listLoading && filteredRows.length === 0 ? <Text style={styles.emptyText}>No data</Text> : null}

        {!listLoading && filteredRows.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator>
            <View style={styles.tableWrap}>
              <View style={styles.tableHeaderRow}>
                {visibleColumns.map(column => (
                  <View key={column} style={styles.tableCell}>
                    <Text style={styles.tableHeaderText}>{column}</Text>
                  </View>
                ))}
                <View style={styles.tableActionCell}>
                  <Text style={styles.tableHeaderText}>View</Text>
                </View>
              </View>

              {filteredRows.map((row, index) => (
                <View
                  key={String(row.id ?? row.job_id ?? index)}
                  style={[styles.tableDataRow, index % 2 === 1 && styles.tableDataRowAlt]}>
                  {visibleColumns.map(column => (
                    <View key={`${String(row.id ?? index)}-${column}`} style={styles.tableCell}>
                      <Text style={styles.tableCellText} numberOfLines={1}>
                        {formatCellValue(row[column])}
                      </Text>
                    </View>
                  ))}
                  <View style={styles.tableActionCell}>
                    <Pressable style={styles.smallActionButton} onPress={() => void handleView(row)}>
                      <Text style={styles.smallActionText}>View</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : null}
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Pile All (Job ID: {selectedJobId ?? '-'})</Text>
              <Pressable style={styles.secondaryButton} onPress={closeModal}>
                <Text style={styles.secondaryButtonText}>Close</Text>
              </Pressable>
            </View>

            {pileErrorText ? <Text style={styles.errorText}>{pileErrorText}</Text> : null}
            {pileLoading ? (
              <ActivityIndicator style={styles.loader} size="large" color="#0B6BFF" />
            ) : null}

            {!pileLoading && pileRows.length === 0 ? <Text style={styles.emptyText}>No data</Text> : null}

            {!pileLoading && pileRows.length > 0 ? (
              <ScrollView>
                <ScrollView horizontal showsHorizontalScrollIndicator>
                  <View style={styles.tableWrap}>
                    <View style={styles.tableHeaderRow}>
                      {pileColumns.map(column => (
                        <View key={column} style={styles.tableCell}>
                          <Text style={styles.tableHeaderText}>{column}</Text>
                        </View>
                      ))}
                    </View>

                    {pileRows.map((row, index) => (
                      <View
                        key={String(row.id ?? row.pile_id ?? index)}
                        style={[styles.tableDataRow, index % 2 === 1 && styles.tableDataRowAlt]}>
                        {pileColumns.map(column => (
                          <View key={`${String(row.id ?? index)}-${column}`} style={styles.tableCell}>
                            <Text style={styles.tableCellText} numberOfLines={1}>
                              {formatCellValue(row[column])}
                            </Text>
                          </View>
                        ))}
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}