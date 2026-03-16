import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Image, Alert, ScrollView, ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { objectsApi } from '../lib/api';
import { Stack } from 'expo-router';

export default function CreateScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo access to continue.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setMimeType(result.assets[0].mimeType || 'image/jpeg');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow camera access.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setMimeType(result.assets[0].mimeType || 'image/jpeg');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return Alert.alert('Error', 'Title is required');
    if (!description.trim()) return Alert.alert('Error', 'Description is required');
    if (!imageUri) return Alert.alert('Error', 'Please pick an image');

    setLoading(true);
    try {
      await objectsApi.create(title, description, imageUri, mimeType);
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message || 'Failed to create object');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'New Object' }} />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Enter description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Image</Text>
        {imageUri ? (
          <TouchableOpacity onPress={pickImage} activeOpacity={0.85}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <Text style={styles.changeText}>Tap to change</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.imagePicker}>
            <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
              <Text style={styles.imageBtnText}>📁  From Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageBtn} onPress={takePhoto}>
              <Text style={styles.imageBtnText}>📷  Take Photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.submitBtn, loading && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Create Object</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8fc' },
  content: { padding: 20, paddingBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 16 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10,
    fontSize: 15, color: '#111827',
  },
  textarea: { height: 100, paddingTop: 10 },
  imagePicker: { flexDirection: 'row', gap: 10 },
  imageBtn: {
    flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10, paddingVertical: 14, alignItems: 'center',
  },
  imageBtnText: { fontSize: 14, color: '#4f46e5', fontWeight: '500' },
  preview: { width: '100%', height: 200, borderRadius: 10, backgroundColor: '#e5e7eb' },
  changeText: { textAlign: 'center', color: '#6b7280', fontSize: 12, marginTop: 6 },
  submitBtn: {
    marginTop: 28, backgroundColor: '#4f46e5', borderRadius: 12,
    paddingVertical: 15, alignItems: 'center',
  },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
