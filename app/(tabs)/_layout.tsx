import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.activeIcon : styles.inactiveIcon,
              ]}
            >
              <Ionicons
                name="home"
                size={20}
                color={focused ? '#F2B705' : 'white'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.activeIcon : styles.inactiveIcon,
              ]}
            >
              <Ionicons
                name="search"
                size={20}
                color={focused ? '#F2B705' : 'white'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.activeIcon : styles.inactiveIcon,
              ]}
            >
              <Ionicons
                name="heart"
                size={20}
                color={focused ? '#F2B705' : 'white'}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused ? styles.activeIcon : styles.inactiveIcon,
              ]}
            >
              <Ionicons
                name="person"
                size={20}
                color={focused ? '#F2B705' : 'white'}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: '20%',
    right: '20%',
    backgroundColor: '#F2B705',
    borderRadius: 40,
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderTopWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',

  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  activeIcon: {
    backgroundColor: 'white',
  },
  inactiveIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});