import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import type { Task } from '@/lib/api';
import { createTask, deleteTask, fetchTasks, updateTask } from '@/lib/tasks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Load tasks
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (e: any) {
      console.log('Fetch tasks failed:', e);
      setError(e?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Add a new task
  const onAdd = useCallback(async () => {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const created = await createTask(newTitle.trim());
      setTasks(prev => [created, ...prev]);
      setNewTitle('');
    } catch (e: any) {
      console.log('Add task error:', e);
    } finally {
      setSubmitting(false);
    }
  }, [newTitle]);

  // Toggle completion
  const toggleComplete = useCallback(async (task: Task) => {
    try {
      const updated = await updateTask(task.id, { completed: !task.completed });
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
    } catch (e: any) {
      console.log('Update task error:', e);
    }
  }, []);

  // Delete task
  const handleDelete = useCallback(async (idStr: string) => {
    setSubmitting(true);
    try {
      console.log('Calling deleteTask API for id:', idStr);
      await deleteTask(idStr);
      console.log('deleteTask API success:', idStr);

      // Optimistic UI update
      setTasks(prev => prev.filter(t => String(t.id) !== idStr));
    } catch (e: any) {
      console.log('Delete failed for id:', idStr, e);
      await load(); // reload if delete fails
    } finally {
      setSubmitting(false);
    }
  }, [load]);

  // Direct delete without Alert
  const onDelete = useCallback((task: Task) => {
    const idStr = String(task.id);
    console.log('Delete triggered for id:', idStr);
    handleDelete(idStr);
  }, [handleDelete]);

  // Render single task
  const renderItem = useCallback(({ item }: { item: Task }) => (
    <View style={styles.itemRow}>
      <Pressable onPress={() => toggleComplete(item)} style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
        {item.completed ? <Text style={styles.checkboxMark}>✓</Text> : null}
      </Pressable>

      <Text style={[styles.itemTitle, item.completed && styles.itemTitleDone]}>{item.title}</Text>

      <Pressable onPress={() => onDelete(item)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>Delete</Text>
      </Pressable>
    </View>
  ), [onDelete, toggleComplete]);

  const listEmpty = useMemo(() => (
    <View style={styles.emptyWrap}>
      <ThemedText>No tasks yet</ThemedText>
    </View>
  ), []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <ThemedText type="title">Tasks</ThemedText>

        <View style={styles.addRow}>
          <TextInput
            value={newTitle}
            onChangeText={setNewTitle}
            placeholder="Add a new task"
            style={styles.input}
            editable={!submitting}
            returnKeyType="done"
            onSubmitEditing={onAdd}
          />
          <Pressable
            onPress={onAdd}
            disabled={submitting || !newTitle.trim()}
            style={[styles.addBtn, (submitting || !newTitle.trim()) && styles.addBtnDisabled]}
          >
            {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>Add</Text>}
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator />
          </View>
        ) : error ? (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={load} style={styles.retryBtn}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={listEmpty}
            contentContainerStyle={tasks.length === 0 ? { flex: 1 } : undefined}
          />
        )}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  addRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, paddingHorizontal: 12, height: 44, backgroundColor: '#fff' },
  addBtn: { backgroundColor: '#0a7ea4', height: 44, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnDisabled: { opacity: 0.6 },
  addBtnText: { color: '#fff', fontWeight: 'bold' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorWrap: { gap: 8, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: 'crimson' },
  retryBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#0a7ea4' },
  retryText: { color: '#fff' },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  itemTitle: { flex: 1, fontSize: 16 },
  itemTitleDone: { textDecorationLine: 'line-through', color: '#999' },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#e11d48', borderRadius: 6 },
  deleteText: { color: '#fff' },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#0a7ea4', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxChecked: { backgroundColor: '#0a7ea4' },
  checkboxMark: { color: '#fff', fontWeight: 'bold' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  separator: { height: 1, backgroundColor: '#eee' },
});
