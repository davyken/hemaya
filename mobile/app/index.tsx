import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, RefreshControl, ActivityIndicator, Alert,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { objectsApi, HeyamaObject } from '../lib/api';
import { useSocket } from '../lib/useSocket';
import { Stack } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const [objects, setObjects] = useState<HeyamaObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [liveFlash, setLiveFlash] = useState(false);

  const load = async () => {
    try {
      const data = await objectsApi.getAll();
      setObjects(data);
    } catch {
      Alert.alert('Error', 'Could not connect to API. Check your IP in lib/api.ts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  useSocket(
    (obj: HeyamaObject) => {
      setObjects((prev) => prev.find((o) => o._id === obj._id) ? prev : [obj, ...prev]);
      setLiveFlash(true);
      setTimeout(() => setLiveFlash(false), 2000);
    },
    ({ id }) => setObjects((prev) => prev.filter((o) => o._id !== id)),
  );

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await objectsApi.remove(id);
          setObjects((prev) => prev.filter((o) => o._id !== id));
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: HeyamaObject }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/object/${item._id}`)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        defaultSource={{ uri: 'https://placehold.co/400x200?text=Loading' }}
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.cardRow}>
          <Text style={styles.cardDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteBtn}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Heyama Cloud' }} />
      <View style={styles.container}>
        {liveFlash && (
          <View style={styles.liveBar}>
            <Text style={styles.liveText}>🔴 Live update received!</Text>
          </View>
        )}

        {loading ? (
          <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 60 }} />
        ) : (
          <FlatList
            data={objects}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Text style={styles.empty}>No objects yet. Create one!</Text>
            }
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />
            }
          />
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },
  list: { padding: 16, gap: 12, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  image: { width: '100%', height: 160, backgroundColor: '#e5e7eb' },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  cardDesc: { fontSize: 13, color: '#6b7280', marginTop: 4, lineHeight: 18 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cardDate: { fontSize: 11, color: '#9ca3af' },
  deleteBtn: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: '#fef2f2', borderRadius: 6 },
  deleteBtnText: { color: '#dc2626', fontSize: 12, fontWeight: '500' },
  fab: {
    position: 'absolute', bottom: 28, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#4f46e5', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },
  empty: { textAlign: 'center', color: '#9ca3af', marginTop: 60, fontSize: 15 },
  liveBar: { backgroundColor: '#dcfce7', paddingVertical: 6, paddingHorizontal: 16 },
  liveText: { color: '#15803d', fontSize: 13, fontWeight: '500', textAlign: 'center' },
});
