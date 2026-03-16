import {
  View, Text, Image, StyleSheet, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { objectsApi, HeyamaObject } from '../../lib/api';

export default function ObjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [obj, setObj] = useState<HeyamaObject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    objectsApi.getOne(id)
      .then(setObj)
      .catch(() => Alert.alert('Error', 'Object not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    Alert.alert('Delete', 'Are you sure you want to delete this object?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await objectsApi.remove(id);
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4f46e5" style={{ marginTop: 60 }} />;
  }

  if (!obj) return null;

  return (
    <>
      <Stack.Screen options={{ title: obj.title, headerRight: () => (
        <TouchableOpacity onPress={handleDelete} style={{ marginRight: 4 }}>
          <Text style={{ color: '#fff', fontSize: 14 }}>Delete</Text>
        </TouchableOpacity>
      )}} />
      <ScrollView style={styles.container}>
        <Image
          source={{ uri: obj.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text style={styles.title}>{obj.title}</Text>
          <Text style={styles.date}>{new Date(obj.createdAt).toLocaleString()}</Text>
          <Text style={styles.description}>{obj.description}</Text>

          <View style={styles.urlBox}>
            <Text style={styles.urlLabel}>Image URL</Text>
            <Text style={styles.url} numberOfLines={3}>{obj.imageUrl}</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },
  image: { width: '100%', height: 260, backgroundColor: '#e5e7eb' },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827' },
  date: { fontSize: 13, color: '#9ca3af', marginTop: 4 },
  description: { fontSize: 15, color: '#374151', marginTop: 16, lineHeight: 22 },
  urlBox: {
    marginTop: 20, padding: 14, backgroundColor: '#f3f4f6',
    borderRadius: 10, borderWidth: 1, borderColor: '#e5e7eb',
  },
  urlLabel: { fontSize: 11, fontWeight: '600', color: '#6b7280', marginBottom: 4, textTransform: 'uppercase' },
  url: { fontSize: 12, color: '#4f46e5' },
});
