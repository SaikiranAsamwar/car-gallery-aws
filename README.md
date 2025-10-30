# Car Gallery AWS Project

A full-stack car showcase application built with Node.js backend and vanilla JavaScript frontend.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- Python 3.x (for serving frontend)

### Running the Project

#### Option 1: Automated Start (Windows)
```bash
# Run the batch file to start both servers automatically
start-project.bat
```

#### Option 2: Manual Start

1. **Start Backend Server:**
```bash
cd Backend
npm install
npm run dev:mock
```
The backend will run on http://localhost:4000

2. **Start Frontend Server:**
```bash
cd Frontend
python -m http.server 3000
```
The frontend will run on http://localhost:3000

3. **Open Browser:**
Navigate to http://localhost:3000

## 🏗️ Architecture

### Backend (Port 4000)
- **Framework**: Express.js
- **Database**: MySQL (Production) / Mock Data (Development)
- **Features**: REST API, CORS enabled, Environment variables

### Frontend (Port 3000)
- **Technology**: Vanilla HTML/CSS/JavaScript
- **Architecture**: Single Page Application
- **Design**: Dark theme with glassmorphism effects

## 📡 API Endpoints

- `GET /api/types` - Get all car types with subtypes
- `GET /api/cars` - Get all cars (supports ?type=X&subtype=Y filtering)
- `GET /api/cars/:id` - Get specific car details

## 🗄️ Database Schema

```sql
types (id, type, description)
├── subtypes (id, type_id, name)  
└── cars (id, name, type, subtype, short_desc, description, features, image_url, created_at)
```

## 🐳 Docker Deployment

```bash
# Build Docker image
cd Backend
docker build -t car-gallery-backend .

# Run container
docker run -p 4000:4000 -e DB_HOST=your-db-host car-gallery-backend
```

## 🌐 AWS Deployment

1. **Database**: AWS RDS MySQL
2. **Backend**: ECS/Fargate or Elastic Beanstalk
3. **Frontend**: S3 + CloudFront

### Environment Variables (.env)
```
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASS=yourpassword  
DB_NAME=car_expo
PORT=4000
```

## 🛠️ Development Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run dev:mock   # Start development server with mock data (no DB required)
```

## 📊 Sample Data

The development server includes mock data for:
- 4 car types (SUV, Sedan, Hatchback, Coupe)
- 6 sample cars with images and detailed specifications
- Full feature lists and descriptions

## 🔧 Troubleshooting

### Database Connection Issues
If you see database connection errors, use the development server:
```bash
npm run dev:mock
```

### CORS Issues
The backend includes CORS middleware. For local development, the frontend connects directly to `http://localhost:4000/api`.

### Port Conflicts
- Backend default: 4000
- Frontend default: 3000
- Modify ports in server.js and start scripts if needed

## 📱 Features

- **Responsive Design**: Works on desktop and mobile
- **Interactive Gallery**: Browse cars by type/subtype
- **Detailed Views**: Full car specifications and features
- **Modern UI**: Dark theme with glassmorphism effects
- **Fast Performance**: Optimized API calls and rendering

## 🚗 Car Categories

- **SUV**: Compact, Mid-size, Full-size, Luxury
- **Sedan**: Compact, Mid-size, Full-size, Luxury  
- **Hatchback**: Subcompact, Compact, Hot Hatch
- **Coupe**: Sports, Luxury, Grand Tourer