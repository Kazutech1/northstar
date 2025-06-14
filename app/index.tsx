
import { router } from 'expo-router';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
// Uncomment the line below if using React Navigation
// import { useNavigation } from '@react-navigation/native';

const NorthStarScreen = () => {
  // Uncomment the line below if using React Navigation hooks instead of props
  // const navigation = useNavigation();

  const handleGetStarted = () => {
    console.log('Navigating to Home Screen!');
    
   
    
    // Option 2: If using a different navigation library, replace the above with your navigation method
    // Example for other navigation libraries:
    router.push('/home');
    // props.navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#ff6b6b" translucent={false} />
      
      <View style={styles.header}>
        <Text style={styles.emoji}>🌟</Text>
        <Text style={styles.title}>My North Star</Text>
        <Text style={styles.subtitle}>Let's explore together!</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{
            uri: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
          }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.sparkles}>
          <Text style={styles.sparkle}>✨</Text>
          <Text style={[styles.sparkle, styles.sparkle2]}>⭐</Text>
          <Text style={[styles.sparkle, styles.sparkle3]}>🌟</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Let's Go!</Text>
      </TouchableOpacity>
      
      <View style={styles.decorativeElements}>
        <Text style={styles.floatingEmoji}>🎈</Text>
        <Text style={[styles.floatingEmoji, styles.floatingEmoji2]}>🌈</Text>
        <Text style={[styles.floatingEmoji, styles.floatingEmoji3]}>☁️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#ff6b6b',
    backgroundImage: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)',
    padding: 20,
    position: 'relative',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.9,
    fontStyle: 'italic',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 50,
    transform: [{ rotate: '-2deg' }],
  },
  image: {
    width: 300,
    height: 220,
    borderRadius: 20,
    borderWidth: 5,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  sparkles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkle: {
    position: 'absolute',
    fontSize: 24,
  },
  sparkle2: {
    top: 20,
    right: 20,
    fontSize: 18,
  },
  sparkle3: {
    bottom: 30,
    left: 30,
    fontSize: 20,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.05 }],
  },
  buttonText: {
    
    color: '#ff6b6b',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  floatingEmoji: {
    position: 'absolute',
    fontSize: 30,
    opacity: 0.6,
  },
  floatingEmoji2: {
    top: 100,
    right: 30,
    fontSize: 25,
  },
  floatingEmoji3: {
    bottom: 150,
    left: 40,
    fontSize: 35,
  },
});

export default NorthStarScreen;