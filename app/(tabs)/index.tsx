import { Link } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎣 Fishing App Admin</Text>
      <Text style={styles.subtitle}>Admin Dashboard System</Text>
      
      <View style={styles.buttonContainer}>
        <Link href="/admindashboard" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>📊 Admin Dashboard</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/event-approval" asChild>
          <TouchableOpacity style={[styles.button, styles.eventButton]}>
            <Text style={styles.buttonText}>🏆 Event Approval Queue</Text>
          </TouchableOpacity>
        </Link>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Use the buttons above to navigate to admin panels
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f6f7f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 320,
    gap: 16,
  },
  button: {
    backgroundColor: '#2b9dee',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  eventButton: {
    backgroundColor: '#003366',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoBox: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    maxWidth: 320,
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});