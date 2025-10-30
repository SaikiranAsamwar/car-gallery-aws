require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve static frontend when deployed together (optional)
app.use(express.static('public')); // put frontend build here

// Mock data for development
const mockTypes = [
  {
    id: 1,
    type: 'SUV',
    description: 'Sport Utility Vehicles with high ground clearance and spacious interiors',
    subtypes: ['Compact SUV', 'Mid-size SUV', 'Full-size SUV', 'Luxury SUV']
  },
  {
    id: 2,
    type: 'Sedan',
    description: 'Traditional four-door passenger cars with separate trunk compartments',
    subtypes: ['Compact Sedan', 'Mid-size Sedan', 'Full-size Sedan', 'Luxury Sedan']
  },
  {
    id: 3,
    type: 'Hatchback',
    description: 'Compact cars with rear door that swings upward to provide access to cargo area',
    subtypes: ['Subcompact Hatchback', 'Compact Hatchback', 'Hot Hatch']
  },
  {
    id: 4,
    type: 'Coupe',
    description: 'Two-door cars with fixed roof and sporty appearance',
    subtypes: ['Sports Coupe', 'Luxury Coupe', 'Grand Tourer']
  }
];

const mockCars = [
  {
    id: 1,
    name: 'Toyota RAV4',
    type: 'SUV',
    subtype: 'Compact SUV',
    short_desc: 'Reliable and fuel-efficient compact SUV',
    description: 'The Toyota RAV4 is a compact crossover SUV that offers excellent fuel economy, reliability, and all-weather capability. Perfect for families and adventure seekers alike.',
    features: ['All-Wheel Drive', 'Safety Sense 2.0', 'Apple CarPlay', 'LED Headlights', 'Roof Rails'],
    image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    name: 'Honda Accord',
    type: 'Sedan',
    subtype: 'Mid-size Sedan',
    short_desc: 'Spacious and efficient mid-size sedan',
    description: 'The Honda Accord delivers a perfect blend of performance, efficiency, and comfort. With its spacious interior and advanced safety features, it\'s an excellent choice for daily commuting.',
    features: ['Honda Sensing', 'CVT Transmission', 'Remote Start', 'Dual-Zone Climate', 'LED Lighting'],
    image_url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
    created_at: '2024-01-16T14:20:00Z'
  },
  {
    id: 3,
    name: 'Volkswagen Golf',
    type: 'Hatchback',
    subtype: 'Compact Hatchback',
    short_desc: 'European-engineered compact hatchback',
    description: 'The Volkswagen Golf sets the standard for compact hatchbacks with its refined driving dynamics, premium interior, and German engineering excellence.',
    features: ['Digital Cockpit', 'MQB Platform', 'Car-Net', 'IQ.DRIVE', 'LED Taillights'],
    image_url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=300&fit=crop',
    created_at: '2024-01-17T09:45:00Z'
  },
  {
    id: 4,
    name: 'BMW 4 Series',
    type: 'Coupe',
    subtype: 'Luxury Coupe',
    short_desc: 'Premium luxury coupe with dynamic performance',
    description: 'The BMW 4 Series Coupe combines athletic performance with luxury comfort. Its distinctive design and advanced technology make every drive an experience to remember.',
    features: ['xDrive AWD', 'iDrive 7.0', 'M Sport Package', 'Harman Kardon Audio', 'Adaptive Suspension'],
    image_url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
    created_at: '2024-01-18T16:10:00Z'
  },
  {
    id: 5,
    name: 'Jeep Grand Cherokee',
    type: 'SUV',
    subtype: 'Mid-size SUV',
    short_desc: 'Capable mid-size SUV with off-road prowess',
    description: 'The Jeep Grand Cherokee offers legendary off-road capability combined with on-road refinement. Perfect for those who demand both luxury and adventure capability.',
    features: ['4x4 Capability', 'Uconnect System', 'Selec-Terrain', 'Premium Audio', 'Panoramic Sunroof'],
    image_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    created_at: '2024-01-19T11:30:00Z'
  },
  {
    id: 6,
    name: 'Mercedes-Benz S-Class',
    type: 'Sedan',
    subtype: 'Luxury Sedan',
    short_desc: 'Ultimate luxury sedan with cutting-edge technology',
    description: 'The Mercedes-Benz S-Class represents the pinnacle of luxury sedans, offering unparalleled comfort, advanced technology, and prestigious styling.',
    features: ['MBUX System', 'Air Suspension', 'Burmester Audio', 'Massage Seats', 'Night Vision'],
    image_url: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&h=300&fit=crop',
    created_at: '2024-01-20T13:15:00Z'
  }
];

// Routes
app.get('/api/types', async (req, res) => {
  try {
    // Simulate database delay
    await new Promise(resolve => setTimeout(resolve, 100));
    res.json(mockTypes);
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/cars', async (req, res) => {
  const { type, subtype } = req.query;
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    let filteredCars = mockCars;
    
    if (type && subtype) {
      filteredCars = mockCars.filter(car => 
        car.type.toLowerCase() === type.toLowerCase() && 
        car.subtype.toLowerCase() === subtype.toLowerCase()
      );
    } else if (type) {
      filteredCars = mockCars.filter(car => 
        car.type.toLowerCase() === type.toLowerCase()
      );
    }
    
    res.json(filteredCars);
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

app.get('/api/cars/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const car = mockCars.find(car => car.id === id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    res.json(car);
  } catch (e) { 
    res.status(500).json({ error: e.message }); 
  }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚗 Car Expo Development Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🎯 Frontend should connect to http://localhost:${PORT}`);
  console.log(`📊 Using mock data (no database required)`);
});