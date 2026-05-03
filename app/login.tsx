import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error: any) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back, Sir!</Text>
          <Text style={styles.subText}>Not Just Used Cars Smart Choices.{"\n"}Join Now And Start Your Search Today.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginButton, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.noAccountText}>Don't have account? </Text>
            <TouchableOpacity onPress={() => router.push('/signup')}>
              <Text style={styles.signupLinkText}>Create account</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.socialSection}>
          <Text style={styles.orText}>Or</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialCircle}>
              <Text style={styles.socialText}>G</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle}>
              <Text style={styles.socialText}>F</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialCircle}>
              <Text style={styles.socialText}>X</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
  },
  welcomeText: {
    fontSize: 32,
    color: '#000',
    marginBottom: 10,
    fontFamily: 'OpenSans_800ExtraBold',
    textTransform: 'uppercase',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'OpenSans_400Regular',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 30,
    marginBottom: 15,
    paddingHorizontal: 20,
    height: 56,
    backgroundColor: '#FFF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#000',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
  loginButton: {
    backgroundColor: '#F2B705',
    height: 56,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'OpenSans_700Bold',
    textTransform: 'uppercase',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
  },
  noAccountText: {
    color: '#999',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
  signupLinkText: {
    color: '#333',
    fontSize: 14,
    fontFamily: 'OpenSans_700Bold',
  },
  socialSection: {
    alignItems: 'center',
  },
  orText: {
    color: '#666',
    marginBottom: 20,
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
    color: '#000',
  },
});
