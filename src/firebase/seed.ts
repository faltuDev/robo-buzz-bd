import { ref, set, get } from 'firebase/database';
import { database } from './config';

const demoProducts = [
  {
    id: 'p1',
    title: 'Arduino Uno R3',
    price: 1200,
    image: 'https://i.ibb.co/NxmKwsc/arduino-uno.jpg',
    category: 'Controllers',
    description: 'The Arduino Uno R3 is a microcontroller board based on the ATmega328P. It has 14 digital input/output pins, 6 analog inputs, a 16 MHz ceramic resonator, a USB connection, a power jack, an ICSP header, and a reset button.',
    stock: 15,
    rating: 4.8,
    freeDelivery: true,
    featured: true
  },
  {
    id: 'p2',
    title: 'Raspberry Pi 4 Model B',
    price: 4500,
    image: 'https://i.ibb.co/3C5KDgv/raspberry-pi.jpg',
    category: 'Single Board Computers',
    description: 'The Raspberry Pi 4 Model B is the latest product in the Raspberry Pi range, boasting a 64-bit quad-core processor running at 1.5GHz, dual-display output via two micro HDMI ports, up to 4GB of RAM, Bluetooth 5.0, and USB 3.0.',
    stock: 8,
    rating: 4.9,
    freeDelivery: true,
    featured: true
  },
  {
    id: 'p3',
    title: 'DC Gear Motor with Encoder',
    price: 850,
    image: 'https://i.ibb.co/cxjMLmT/dc-motor.jpg',
    category: 'Motors',
    description: 'High torque DC gear motor with encoder for accurate positioning. Ideal for robotics projects requiring precise movement control.',
    stock: 22,
    rating: 4.5,
    freeDelivery: false,
    featured: false
  },
  {
    id: 'p4',
    title: 'Ultrasonic Distance Sensor HC-SR04',
    price: 180,
    image: 'https://i.ibb.co/0tJMn5H/ultrasonic-sensor.jpg',
    category: 'Sensors',
    description: 'The HC-SR04 ultrasonic sensor uses sonar to determine distance to an object like bats do. It offers excellent non-contact range detection with high accuracy and stable readings.',
    stock: 50,
    rating: 4.3,
    freeDelivery: true,
    featured: false
  },
  {
    id: 'p5',
    title: 'MG996R Servo Motor',
    price: 450,
    image: 'https://i.ibb.co/kxL3XBZ/servo-motor.jpg',
    category: 'Motors',
    description: 'The MG996R is a high-torque metal gear servo motor designed for robotics applications. Perfect for projects requiring high precision and power.',
    stock: 18,
    rating: 4.7,
    freeDelivery: false,
    featured: true
  },
  {
    id: 'p6',
    title: 'Robot Chassis Kit with Motors',
    price: 1800,
    image: 'https://i.ibb.co/8x9b2sv/robot-chassis.jpg',
    category: 'Kits',
    description: 'Complete robot chassis kit with DC motors, wheels, and mounting hardware. Ideal starter base for building your own robot.',
    stock: 10,
    rating: 4.6,
    freeDelivery: true,
    featured: true
  },
  {
    id: 'p7',
    title: 'MPU6050 Gyroscope Accelerometer Sensor',
    price: 250,
    image: 'https://i.ibb.co/vkKNY6c/mpu6050.jpg',
    category: 'Sensors',
    description: 'The MPU6050 combines a 3-axis gyroscope and a 3-axis accelerometer on the same silicon die, with an onboard Digital Motion Processor capable of processing complex motion fusion algorithms.',
    stock: 25,
    rating: 4.4,
    freeDelivery: false,
    featured: false
  },
  {
    id: 'p8',
    title: 'L298N Motor Driver Module',
    price: 320,
    image: 'https://i.ibb.co/TqsMVcP/l298n-motor-driver.jpg',
    category: 'Controllers',
    description: 'The L298N motor driver module can control the speed and direction of two DC motors simultaneously. It can handle motors that operate between 5V and 35V DC.',
    stock: 30,
    rating: 4.5,
    freeDelivery: true,
    featured: false
  }
];

const demoCategories = [
  {
    id: 'c1',
    name: 'Controllers',
    image: 'https://i.ibb.co/F5mKvxm/controllers.jpg'
  },
  {
    id: 'c2',
    name: 'Single Board Computers',
    image: 'https://i.ibb.co/RQhV0Xf/single-board-computers.jpg'
  },
  {
    id: 'c3',
    name: 'Motors',
    image: 'https://i.ibb.co/9ZWkzfP/motors.jpg'
  },
  {
    id: 'c4',
    name: 'Sensors',
    image: 'https://i.ibb.co/BjCPWdL/sensors.jpg'
  },
  {
    id: 'c5',
    name: 'Kits',
    image: 'https://i.ibb.co/CVpDdvw/kits.jpg'
  }
];

const demoOffers = [
  {
    id: 'o1',
    title: 'Summer Sale',
    discount: '15% OFF',
    description: 'Get 15% off on all robotics kits',
    image: 'https://i.ibb.co/8dMWDVK/summer-sale.jpg',
    validUntil: '2025-08-31'
  },
  {
    id: 'o2',
    title: 'Free Shipping',
    discount: 'FREE DELIVERY',
    description: 'Free shipping on orders over ৳3000',
    image: 'https://i.ibb.co/FxjDnxk/free-shipping.jpg',
    validUntil: '2025-12-31'
  },
  {
    id: 'o3',
    title: 'Student Discount',
    discount: '10% OFF',
    description: 'Special discount for students with valid ID',
    image: 'https://i.ibb.co/9s6WB3q/student-discount.jpg',
    validUntil: '2025-12-31'
  }
];

export const seedDatabase = async () => {
  try {
    // Check if products already exist
    const productsSnapshot = await get(ref(database, 'products'));
    if (!productsSnapshot.exists()) {
      // Seed products
      await set(ref(database, 'products'), demoProducts);
      console.log('Products seeded successfully');
    }

    // Check if categories already exist
    const categoriesSnapshot = await get(ref(database, 'categories'));
    if (!categoriesSnapshot.exists()) {
      // Seed categories
      await set(ref(database, 'categories'), demoCategories);
      console.log('Categories seeded successfully');
    }

    // Check if offers already exist
    const offersSnapshot = await get(ref(database, 'offers'));
    if (!offersSnapshot.exists()) {
      // Seed offers
      await set(ref(database, 'offers'), demoOffers);
      console.log('Offers seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};