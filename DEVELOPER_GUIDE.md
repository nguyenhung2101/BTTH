# 👨‍💻 Hướng Dẫn Phát Triển - Ứng Dụng Thể Dục

## 📚 Kiến Trúc Ứng Dụng

### Cấu Trúc Mô Hình (Models)

Tất cả các type definitions được định nghĩa trong `src/models/fitness.ts`:

```typescript
// Types cho Workout Logs
type ExerciseType = 'CARDIO' | 'STRENGTH' | 'YOGA' | 'HIIT' | 'OTHER';
interface WorkoutLog {
  id: string;
  date: string;
  exerciseType: ExerciseType;
  duration: number;
  calories: number;
  notes: string;
  status: 'COMPLETED' | 'MISSED';
}

// Types cho Health Metrics
interface HealthMetrics {
  id: string;
  date: string;
  weight: number;
  height: number;
  restingHeartRate: number;
  sleepHours: number;
  bmi?: number;
  bmiCategory?: BMICategory;
}

// Types cho Goals
interface Goal {
  id: string;
  name: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  deadline: string;
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

// Types cho Exercises
interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  difficulty: DifficultyLevel;
  description: string;
  instructions: string;
  caloriesPerHour: number;
  createdAt: string;
  updatedAt: string;
}
```

### Dịch Vụ (Services)

Tất cả các API calls được quản lý trong `src/services/fitness.ts`:

**BMI Utilities**:
```typescript
calculateBMI(weight: number, height: number): number
getBMICategory(bmi: number): BMICategory
getBMIInfo(bmi: number): BMIInfo
```

**Workout Services**:
```typescript
getWorkoutLogs()
createWorkoutLog()
updateWorkoutLog()
deleteWorkoutLog()
```

**Health Metrics Services**:
```typescript
getHealthMetrics()
createHealthMetrics()
updateHealthMetrics()
deleteHealthMetrics()
```

**Goal Services**:
```typescript
getGoals()
createGoal()
updateGoal()
deleteGoal()
```

**Exercise Services**:
```typescript
getExercises()
createExercise()
updateExercise()
deleteExercise()
```

**Dashboard Services**:
```typescript
getDashboardStats()
getWeeklyWorkoutData()
getWeightTrendData()
getRecentWorkouts()
```

### Pages (Trang)

#### 1. Dashboard (`src/pages/TheDuc/`)
- Hiển thị 4 stat cards
- 2 biểu đồ (Weekly workouts, Weight trend)
- Timeline 5 buổi tập gần nhất
- **Components con**:
  - `WeeklyChart.tsx` - Biểu đồ cột
  - `WeightChart.tsx` - Biểu đồ đường

#### 2. Workout Journal (`src/pages/NhatKyTapLuyen/`)
- Bảng danh sách workouts
- Filters & Search
- Modal form thêm/sửa
- Popconfirm xóa

#### 3. Health Metrics (`src/pages/NhatKyChiSo/`)
- Bảng chỉ số sức khỏe
- BMI auto-calculated với tag color
- Modal form thêm/sửa
- Popconfirm xóa

#### 4. Goal Management (`src/pages/QuanLyMucTieu/`)
- Grid layout cards
- Inline editing cho current value
- Progress bar auto-calculated
- Drawer form thêm/sửa
- Segmented filter

#### 5. Exercise Library (`src/pages/ThuVienBaiTap/`)
- Grid layout (3 cột) cards
- Filters & Search
- Detail Drawer modal
- Add/Edit/Delete modals

### Mock Data

**Mock Data Generation** (`src/mock/fitness.ts`):
```typescript
generateMockWorkouts()
generateMockHealthMetrics()
generateMockGoals()
generateMockExercises()
generateDashboardStats()
generateWeeklyWorkoutData()
generateWeightTrendData()
```

**API Endpoints** (`src/mock/fitness-api.ts`):
- `GET/POST/PUT/DELETE /api/workouts`
- `GET/POST/PUT/DELETE /api/health-metrics`
- `GET/POST/PUT/DELETE /api/goals`
- `GET/POST/PUT/DELETE /api/exercises`
- `GET /api/dashboard/*`

## 🔄 Quy Trình Phát Triển

### Thêm Tính Năng Mới

1. **Định nghĩa Type** trong `src/models/fitness.ts`
2. **Tạo Service** trong `src/services/fitness.ts`
3. **Tạo Mock Data** trong `src/mock/fitness.ts`
4. **Tạo Mock API** trong `src/mock/fitness-api.ts`
5. **Tạo Component** trong `src/pages/YourPage/`
6. **Thêm Route** trong `config/routes.ts`

### Ví Dụ: Thêm Tính Năng Mới

Giả sử bạn muốn thêm "Nutrition Tracking":

**1. Model** (`src/models/fitness.ts`):
```typescript
interface NutritionLog {
  id: string;
  date: string;
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}
```

**2. Service** (`src/services/fitness.ts`):
```typescript
export async function getNutritionLogs(): Promise<NutritionLog[]> {
  return request('/api/nutrition-logs');
}
// ... create, update, delete methods
```

**3. Mock Data** (`src/mock/fitness.ts`):
```typescript
export const generateMockNutritionLogs = (): NutritionLog[] => {
  // Generate mock data
};
```

**4. Mock API** (`src/mock/fitness-api.ts`):
```typescript
'GET /api/nutrition-logs': async (req, res) => {
  res.json(generateMockNutritionLogs());
},
// ... other CRUD operations
```

**5. Page** (`src/pages/NutritionTracking/index.tsx`):
```typescript
export default function NutritionTracking() {
  // Component code
}
```

**6. Route** (`config/routes.ts`):
```typescript
{
  path: 'nutrition',
  name: 'NutritionTracking',
  component: './NutritionTracking',
}
```

## 📊 State Management

Ứng dụng sử dụng React Hooks cho state management:

```typescript
// Loading state
const [loading, setLoading] = useState(false);

// Data state
const [data, setData] = useState<T[]>([]);

// Modal/Drawer state
const [visible, setVisible] = useState(false);

// Edit state
const [editingId, setEditingId] = useState<string | null>(null);

// Filter state
const [filter, setFilter] = useState<FilterType>('value');
```

## 🎨 Styling

- Sử dụng LESS modules (`.less` files)
- Ant Design styling system
- Responsive utilities:
  ```typescript
  <Col xs={24} sm={12} lg={8} /> // Mobile, Tablet, Desktop
  ```

## 🔌 API Integration

### Current Implementation (Mock)

```typescript
// Using @umijs/max request
import { request } from '@umijs/max';

const data = await request('/api/endpoint', {
  method: 'GET',
  params: { /* ... */ },
});
```

### Production Implementation

Khi chuyển sang production, chỉ cần thay đổi:
1. Mock endpoints thành thật
2. Error handling & retry logic
3. Authentication headers

Services sẽ hoạt động không thay đổi.

## 🧪 Testing

### Unit Tests

```typescript
import { calculateBMI, getBMICategory } from '@/services/fitness';

describe('BMI Calculation', () => {
  test('should calculate BMI correctly', () => {
    const bmi = calculateBMI(70, 175);
    expect(bmi).toBeCloseTo(22.9, 1);
  });

  test('should categorize BMI correctly', () => {
    const category = getBMICategory(22.9);
    expect(category).toBe('NORMAL');
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from '@/pages/TheDuc';

describe('Dashboard', () => {
  test('should render 4 stat cards', async () => {
    render(<Dashboard />);
    const cards = await screen.findAllByRole('heading');
    expect(cards.length).toBe(4);
  });
});
```

## 🐛 Debugging

### Development Mode

```bash
npm run start:dev
```

### Browser DevTools

- **React DevTools**: Inspect component state
- **Redux DevTools**: N/A (using hooks)
- **Network Tab**: Monitor API calls

### Console Logging

```typescript
console.log('Debug:', data);
// Error catching
catch (error) {
  console.error('Error:', error);
}
```

## 📈 Performance Optimization

1. **Memoization**:
```typescript
const MemoComponent = React.memo(Component);
useMemo(() => expensiveCalculation(), [deps]);
useCallback(() => handleClick, [deps]);
```

2. **Code Splitting**:
```typescript
const Component = lazy(() => import('./Component'));
```

3. **Image Optimization**:
- Use appropriate formats
- Lazy load images

## 🔐 Security Considerations

1. **Input Validation**: Validate tất cả user inputs
2. **XSS Prevention**: React auto-escapes output
3. **CSRF Protection**: Implement token headers
4. **Authentication**: Maintain session tokens

## 📦 Build & Deployment

### Build
```bash
npm run build
```

### Deploy
```bash
npm run deploy
# hoặc Windows
npm run deploy-win
```

## 🚨 Error Handling

Standardized error handling pattern:

```typescript
try {
  const data = await fetchData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  message.error(error?.message || 'Lỗi không xác định');
}
```

## 📝 Code Style

- ESLint configuration: `.eslintrc.js`
- Prettier configuration: `.prettierrc`
- Format code: `npm run lint:fix`

## 🎯 Best Practices

1. ✅ Luôn sử dụng TypeScript types
2. ✅ Xử lý error cases
3. ✅ Thêm loading states
4. ✅ Validate form inputs
5. ✅ Sử dụng semantic HTML
6. ✅ Responsive design
7. ✅ Accessibility (a11y)
8. ✅ Performance optimization

---

**Happy Coding! 🚀**
