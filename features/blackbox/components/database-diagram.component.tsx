'use client';

/**
 * Database Diagram Component
 * Visual representation of database entities and their relationships
 */
export function DatabaseDiagram() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 overflow-auto">
      <div className="min-w-[1200px]">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Database Schema Diagram</h2>
        
        {/* Legend */}
        <div className="mb-8 flex flex-wrap gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div>
            <span>Entity (Collection)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-blue-600"></div>
            <span>Reference (Foreign Key)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-green-600 border-dashed border-2"></div>
            <span>Embedded (Array)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs font-mono">PK</span>
            <span>Primary Key</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-mono">FK</span>
            <span>Foreign Key</span>
          </div>
        </div>

        {/* Diagram Container */}
        <div className="relative" style={{ height: '1100px' }}>
          <svg
            width="100%"
            height="100%"
            className="absolute inset-0"
            viewBox="0 0 2000 1100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Relationships - Draw lines first so they appear behind boxes */}
            
            {/* Users -> Subscriptions (customerId) */}
            <line x1="300" y1="200" x2="750" y2="200" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="520" y="195" className="text-xs fill-gray-600">customerId</text>
            
            {/* Users -> Subscriptions (assignedBy) */}
            <line x1="300" y1="250" x2="750" y2="250" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="520" y="245" className="text-xs fill-gray-600">assignedBy</text>
            
            {/* Users -> DailyAssignments (customerId) */}
            <line x1="300" y1="300" x2="750" y2="700" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="500" y="500" className="text-xs fill-gray-600">customerId</text>
            
            {/* Users -> DailyAssignments (assignedBy) */}
            <line x1="300" y1="350" x2="750" y2="750" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="500" y="550" className="text-xs fill-gray-600">assignedBy</text>
            
            {/* Users -> MealTemplates (createdBy) */}
            <line x1="300" y1="400" x2="1150" y2="200" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="700" y="300" className="text-xs fill-gray-600">createdBy</text>
            
            {/* Users -> ExerciseTemplates (createdBy) */}
            <line x1="300" y1="450" x2="1150" y2="450" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowhead)" />
            <text x="700" y="450" className="text-xs fill-gray-600">createdBy</text>
            
            {/* Meals -> MealTemplates (embedded) */}
            <line x1="1550" y1="200" x2="1370" y2="200" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-green)" />
            <text x="1430" y="195" className="text-xs fill-gray-600">meals[]</text>
            
            {/* Meals -> DailyAssignments (embedded) */}
            <line x1="1550" y1="250" x2="750" y2="800" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-green)" />
            <text x="1100" y="525" className="text-xs fill-gray-600">meals[]</text>
            
            {/* Exercises -> ExerciseTemplates (embedded) */}
            <line x1="1550" y1="500" x2="1370" y2="450" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-green)" />
            <text x="1430" y="475" className="text-xs fill-gray-600">exercises[]</text>
            
            {/* Exercises -> DailyAssignments (embedded) */}
            <line x1="1550" y1="550" x2="750" y2="850" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrowhead-green)" />
            <text x="1100" y="700" className="text-xs fill-gray-600">exercises[]</text>

            {/* Arrow markers */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
              </marker>
              <marker id="arrowhead-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
              </marker>
            </defs>

            {/* Entity Boxes */}
            
            {/* Users - Left column, top */}
            <EntityBox
              x={50}
              y={150}
              width={200}
              name="Users"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'email', type: 'string' },
                { name: 'password', type: 'string?' },
                { name: 'name', type: 'string' },
                { name: 'roleId', type: 'RoleId' },
                { name: 'phone', type: 'string?' },
                { name: 'instagram', type: 'string?' },
                { name: 'createdAt', type: 'Date' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* Subscriptions - Middle column, top */}
            <EntityBox
              x={750}
              y={150}
              width={240}
              name="Subscriptions"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'customerId', type: 'string', isFk: true },
                { name: 'planName', type: 'string' },
                { name: 'startDate', type: 'Date' },
                { name: 'endDate', type: 'Date' },
                { name: 'status', type: 'enum' },
                { name: 'paymentScreenshot', type: 'string?' },
                { name: 'assignedBy', type: 'string', isFk: true },
                { name: 'createdAt', type: 'Date' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* DailyAssignments - Middle column, bottom */}
            <EntityBox
              x={750}
              y={650}
              width={240}
              name="DailyAssignments"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'customerId', type: 'string', isFk: true },
                { name: 'date', type: 'Date' },
                { name: 'meals', type: 'Meal[]', isEmbedded: true },
                { name: 'exercises', type: 'Exercise[]', isEmbedded: true },
                { name: 'assignedBy', type: 'string', isFk: true },
                { name: 'createdAt', type: 'Date' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* MealTemplates - Right column, top */}
            <EntityBox
              x={1150}
              y={150}
              width={240}
              name="MealTemplates"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string?' },
                { name: 'meals', type: 'Meal[]', isEmbedded: true },
                { name: 'createdBy', type: 'string', isFk: true },
                { name: 'createdAt', type: 'Date' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* ExerciseTemplates - Right column, middle */}
            <EntityBox
              x={1150}
              y={400}
              width={240}
              name="ExerciseTemplates"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string?' },
                { name: 'exercises', type: '{day, exercises[]}[]', isEmbedded: true },
                { name: 'createdBy', type: 'string', isFk: true },
                { name: 'createdAt', type: 'Date' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* Meals - Far right column, top */}
            <EntityBox
              x={1550}
              y={150}
              width={200}
              name="Meals"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string?' },
                { name: 'calories', type: 'number' },
                { name: 'protein', type: 'number' },
                { name: 'carbs', type: 'number' },
                { name: 'fats', type: 'number' },
                { name: 'mealType', type: 'enum' },
                { name: 'createdAt', type: 'Date?' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />

            {/* Exercises - Far right column, middle */}
            <EntityBox
              x={1550}
              y={450}
              width={200}
              name="Exercises"
              fields={[
                { name: '_id', type: 'ObjectId', isPk: true },
                { name: 'name', type: 'string' },
                { name: 'description', type: 'string?' },
                { name: 'sets', type: 'number?' },
                { name: 'reps', type: 'number?' },
                { name: 'duration', type: 'number?' },
                { name: 'restTime', type: 'number?' },
                { name: 'muscleGroups', type: 'string[]' },
                { name: 'createdAt', type: 'Date?' },
                { name: 'updatedAt', type: 'Date?' },
              ]}
            />
          </svg>
        </div>

        {/* Relationship Summary */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Relationship Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">References (Foreign Keys):</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Subscriptions.customerId → Users._id</li>
                <li>Subscriptions.assignedBy → Users._id</li>
                <li>DailyAssignments.customerId → Users._id</li>
                <li>DailyAssignments.assignedBy → Users._id</li>
                <li>MealTemplates.createdBy → Users._id</li>
                <li>ExerciseTemplates.createdBy → Users._id</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Embedded (Arrays):</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>MealTemplates.meals[] → Meals (embedded)</li>
                <li>ExerciseTemplates.exercises[] → Exercises (embedded)</li>
                <li>DailyAssignments.meals[] → Meals (embedded)</li>
                <li>DailyAssignments.exercises[] → Exercises (embedded)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EntityBoxProps {
  x: number;
  y: number;
  width: number;
  name: string;
  fields: Array<{ name: string; type: string; isPk?: boolean; isFk?: boolean; isEmbedded?: boolean }>;
}

function EntityBox({ x, y, width, name, fields }: EntityBoxProps) {
  const headerHeight = 40;
  const fieldHeight = 24;
  const totalHeight = headerHeight + fields.length * fieldHeight + 10;

  return (
    <g>
      {/* Box */}
      <rect
        x={x}
        y={y}
        width={width}
        height={totalHeight}
        fill="#f9fafb"
        stroke="#3b82f6"
        strokeWidth="2"
        rx="4"
      />
      
      {/* Header */}
      <rect
        x={x}
        y={y}
        width={width}
        height={headerHeight}
        fill="#3b82f6"
        rx="4"
      />
      <text
        x={x + width / 2}
        y={y + 26}
        textAnchor="middle"
        className="text-white font-bold text-sm"
      >
        {name}
      </text>

      {/* Fields */}
      {fields.map((field, index) => (
        <g key={field.name}>
          <text
            x={x + 8}
            y={y + headerHeight + (index + 1) * fieldHeight - 6}
            className="text-xs fill-gray-800 font-mono"
          >
            {field.name}
            {field.isPk && (
              <tspan className="fill-yellow-600 font-bold"> (PK)</tspan>
            )}
            {field.isFk && (
              <tspan className="fill-purple-600 font-bold"> (FK)</tspan>
            )}
            {field.isEmbedded && (
              <tspan className="fill-green-600 font-bold"> (embedded)</tspan>
            )}
            <tspan className="fill-gray-500"> : {field.type}</tspan>
          </text>
        </g>
      ))}
    </g>
  );
}

