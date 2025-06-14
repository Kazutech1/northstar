import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native'
import React, { useState, useRef } from 'react'
import { Tabs, useRouter, usePathname } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

const { height } = Dimensions.get('window');

export default function TabLayout() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const tabItems = [
    {
      name: 'home',
      icon: 'home',
      color: '#4ecdc4',
      label: 'Home',
      route: '/home'
    },
    {
      name: 'log',
      icon: 'document-text',
      color: '#e74c3c',
      label: 'Log',
      route: '/log'
    },
    {
      name: 'longTerm',
      icon: 'flag',
      color: '#27ae60',
      label: 'Goals',
      route: '/longTerm'
    }
  ];

  const getCurrentTabColor = () => {
    const currentTab = tabItems.find(tab => pathname.includes(tab.name));
    return currentTab ? currentTab.color : '#4ecdc4';
  };

  const getCurrentTabIcon = () => {
    const currentTab = tabItems.find(tab => pathname.includes(tab.name));
    return currentTab ? currentTab.icon : 'apps';
  };

  const toggleMenu = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    setIsExpanded(!isExpanded);
  };

  const handleTabPress = (route) => {
    if (pathname !== route) {
      router.push(route);
    }
    setIsExpanded(false);
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 0, useNativeDriver: true }),
      Animated.timing(rotateAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '135deg'],
  });

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: { display: 'none' },
          headerShown: false,
        }}
      >
        <Tabs.Screen name='home' />
        <Tabs.Screen name='log' />
        <Tabs.Screen name='longTerm' />
      </Tabs>
      
      {/* Floating Tab Button */}
      <View style={{
        position: 'absolute',
        right: 0,
        top: height * 0.4,
        zIndex: 1000,
        alignItems: 'flex-end',
      }}>
        {/* Tab Items */}
        {tabItems.map((item) => {
          const isActive = pathname.includes(item.name);
          
          return (
            <Animated.View
              key={item.name}
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: scaleAnim,
                marginBottom: 16,
              }}
            >
              <TouchableOpacity
                onPress={() => handleTabPress(item.route)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingLeft: 16,
                  paddingRight: 12,
                  borderTopLeftRadius: 25,
                  borderBottomLeftRadius: 25,
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 4,
                  minWidth: 120,
                }}
              >
                <View style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: isActive ? item.color : '#f0f0f0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={isActive ? 'white' : '#666'}
                  />
                </View>
                
                <Text style={{
                  fontSize: 14,
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? item.color : '#666',
                }}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* Main FAB */}
        <TouchableOpacity
          onPress={toggleMenu}
          style={{
            width: 60,
            height: 60,
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: getCurrentTabColor(),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 8,
            marginTop: 16,
          }}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            <Ionicons
              name={isExpanded ? 'close' : getCurrentTabIcon()}
              size={24}
              color="white"
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
}