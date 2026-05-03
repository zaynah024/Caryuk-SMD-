import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  toggleFavorite: (carId: string) => Promise<void>;
  toggleCart: (carId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateQuantity: (carId: string, delta: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  toggleFavorite: async () => {},
  toggleCart: async () => {},
  clearCart: async () => {},
  updateQuantity: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // If logged in, listen to the user's profile in Firestore
        const unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (doc) => {
          if (doc.exists()) {
            setProfile(doc.data());
          } else {
            setProfile({ fullName: 'New User', favorites: [] }); 
          }
          setLoading(false);
        }, (error) => {
          console.error("Profile listen error:", error);
          setLoading(false);
        });

        return () => unsubscribeProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const toggleFavorite = async (carId: string) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const isFavorited = profile?.favorites?.includes(carId);

    try {
      if (isFavorited) {
        await setDoc(userRef, {
          favorites: arrayRemove(carId)
        }, { merge: true });
      } else {
        await setDoc(userRef, {
          favorites: arrayUnion(carId)
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const toggleCart = async (carId: string) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const isInCart = profile?.cart?.includes(carId);

    try {
      if (isInCart) {
        const updatedQuantities = { ...profile?.cartQuantities };
        delete updatedQuantities[carId];
        await setDoc(userRef, {
          cart: arrayRemove(carId),
          cartQuantities: updatedQuantities
        }, { merge: true });
      } else {
        await setDoc(userRef, {
          cart: arrayUnion(carId),
          cartQuantities: {
            ...profile?.cartQuantities,
            [carId]: 1
          }
        }, { merge: true });
      }
    } catch (error) {
      console.error("Error toggling cart:", error);
    }
  };

  const clearCart = async () => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userRef, { cart: [], cartQuantities: {} }, { merge: true });
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const updateQuantity = async (carId: string, delta: number) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    const currentQty = profile?.cartQuantities?.[carId] || 1;
    const newQty = Math.max(1, currentQty + delta);
    
    try {
      await setDoc(userRef, {
        cartQuantities: {
          ...profile?.cartQuantities,
          [carId]: newQty
        }
      }, { merge: true });
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, toggleFavorite, toggleCart, clearCart, updateQuantity }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
