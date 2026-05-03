const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDhm1fxQyjmRWwCa1bBqJJHNdtDG26quYI",
  authDomain: "caryuk-23c3d.firebaseapp.com",
  projectId: "caryuk-23c3d",
  storageBucket: "caryuk-23c3d.firebasestorage.app",
  messagingSenderId: "607528532648",
  appId: "1:607528532648:web:216a05a3a3ca611e61a09d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const demoCars = [
  {
    name: 'Nissan Skyline R34',
    price: 95000,
    style: 'Midnight Blue',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000',
    description: 'The legendary "Godzilla". This R34 GT-R V-Spec II is a masterpiece of Japanese engineering, featuring the iconic RB26DETT engine and ATTESA E-TS Pro AWD system.',
    features: ['RB26DETT Engine', 'AWD System', 'NISMO Body Kit', 'Brembo Brakes'],
    vehicleInfo: 'Year: 2002 | Mileage: 45,000 km | Transmission: 6-Speed Manual',
    sellerName: 'JDMotors',
    sellerPhone: '+1234567890'
  },
  {
    name: 'Mustang Shelby',
    price: 85000,
    style: 'Stealth Black',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000',
    description: 'Raw American muscle. The Shelby GT500 delivers track-ready performance with a supercharged V8 that produces heart-pounding horsepower.',
    features: ['Supercharged V8', 'Launch Control', 'Magneride Damping', 'Recaro Seats'],
    vehicleInfo: 'Year: 2021 | Mileage: 5,000 km | Transmission: 7-Speed Dual Clutch',
    sellerName: 'MuscleHaven',
    sellerPhone: '+1987654321'
  },
  {
    name: 'Toyota Supra Mk4',
    price: 120000,
    style: 'Silver',
    image: 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?q=80&w=1000',
    description: 'The definitive 90s supercar. This twin-turbo Supra is a tuner’s dream, preserved in immaculate condition with its original 2JZ-GTE engine.',
    features: ['2JZ-GTE Engine', 'Getrag 6-Speed', 'Rear Wing', 'Turbo Timer'],
    vehicleInfo: 'Year: 1998 | Mileage: 60,000 km | Transmission: Manual',
    sellerName: 'TokyoDrift',
    sellerPhone: '+81901234567'
  },
  {
    name: 'Audi R8',
    price: 140000,
    style: 'Daytona Grey',
    image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?q=80&w=1000',
    description: 'The everyday supercar. Combining Audi’s Quattro AWD with a mid-mounted V10 engine, the R8 offers breathtaking speed with German precision.',
    features: ['V10 Engine', 'Quattro AWD', 'Virtual Cockpit', 'Carbon Fiber Sideblades'],
    vehicleInfo: 'Year: 2023 | Mileage: 1,200 km | Transmission: S-Tronic',
    sellerName: 'EuroPerform',
    sellerPhone: '+491512345678'
  },
  {
    name: 'Honda Civic Type R',
    price: 35000,
    style: 'Championship White',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1000',
    description: 'The king of front-wheel drive. The Type R is a precision tool for the track that you can still drive to the grocery store.',
    features: ['Turbocharged VTEC', 'Adaptive Steering', 'Rev-Match System', 'Brembo Front Calipers'],
    vehicleInfo: 'Year: 2022 | Mileage: 8,000 km | Transmission: 6-Speed Manual',
    sellerName: 'Civic Center',
    sellerPhone: '+15551234567'
  },
  {
    name: 'McLaren 720S',
    price: 320000,
    style: 'Volcano Red',
    image: 'https://images.unsplash.com/photo-1621135802920-133df287f89c?q=80&w=1000',
    description: 'Alien technology for the road. The 720S boasts a carbon fiber tub and a twin-turbo V8 producing exactly 720 horsepower.',
    features: ['Twin-Turbo V8', 'Carbon Fiber Monocage', 'Proactive Chassis Control', 'Dihedral Doors'],
    vehicleInfo: 'Year: 2022 | Mileage: 2,500 km | Transmission: 7-Speed SSG',
    sellerName: 'ExoMotors',
    sellerPhone: '+18005550001'
  },
  {
    name: 'Porsche 911 GT3',
    price: 185000,
    style: 'Shark Blue',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=1000',
    description: 'Born in Flacht. A naturally aspirated 4.0L flat-six that revs to 9000 RPM, paired with unparalleled chassis dynamics.',
    features: ['4.0L Flat-Six', 'PDK Transmission', 'Swan Neck Rear Wing', 'Carbon Ceramic Brakes'],
    vehicleInfo: 'Year: 2023 | Mileage: 800 km | Transmission: 7-Speed PDK',
    sellerName: 'StuttClassics',
    sellerPhone: '+18005550002'
  },
  {
    name: 'Ferrari F8 Tributo',
    price: 280000,
    style: 'Rosso Corsa',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000',
    description: 'A tribute to the most powerful V8 in Ferrari history. Breathtaking design meets aerodynamic perfection.',
    features: ['Twin-Turbo V8', 'Side Slip Control', 'S-Duct Aerodynamics', 'Lexan Engine Cover'],
    vehicleInfo: 'Year: 2021 | Mileage: 4,200 km | Transmission: 7-Speed F1 DCT',
    sellerName: 'FerImports',
    sellerPhone: '+18005550003'
  }
];

async function seed() {
  console.log('Cleaning existing cars...');
  const querySnapshot = await getDocs(collection(db, 'cars'));
  for (const docSnapshot of querySnapshot.docs) {
    await deleteDoc(doc(db, 'cars', docSnapshot.id));
  }

  console.log('Seeding 8 premium cars with rich detail data...');
  try {
    for (const car of demoCars) {
      await addDoc(collection(db, 'cars'), {
        ...car,
        liked: false,
        createdAt: new Date().toISOString()
      });
      console.log('Added: ', car.name);
    }
    console.log('Done!');
    process.exit(0);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}

seed();
