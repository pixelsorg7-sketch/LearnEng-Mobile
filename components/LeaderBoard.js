import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const users = [
  { id: '1', name: 'Davis Curtis', points: 2569, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '2', name: 'Alena Donin', points: 1469, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '3', name: 'Craig Gouse', points: 1053, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '4', name: 'Madelyn Dias', points: 950, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '5', name: 'Zain Vaccaro', points: 448, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '6', name: 'Skylar Geidt', points: 448, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
  { id: '7', name: 'Justin Bator', points: 448, avatar: 'https://upload.wikimedia.org/wikipedia/en/8/84/CureMarine.png' },
];

const medalIcons = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

export default function LeaderBoard({ navigation }) {
  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <Text style={styles.rank}>{index + 1}</Text>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.points}>{item.points} points</Text>
      </View>
      {index < 3 && <Text style={styles.medal}>{medalIcons[index + 1]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Leader boards</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#002A5C',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#0353A4',
    borderRadius: 8,
    padding: 6,
    marginRight: 10,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  list: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6ff',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  rank: {
    width: 24,
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderRadius: 20,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#003366',
  },
  points: {
    color: '#555',
    fontSize: 13,
  },
  medal: {
    fontSize: 20,
    marginLeft: 8,
  },
});
