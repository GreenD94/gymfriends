'use client';

interface WeeklyCalendarProps {
  assignments: any[];
  currentWeek: Date;
  onWeekChange: (date: Date) => void;
}

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function WeeklyCalendar({ assignments, currentWeek, onWeekChange }: WeeklyCalendarProps) {
  const weekStart = getWeekStart(currentWeek);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  function getWeekStart(date: Date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    onWeekChange(newDate);
  };

  const getDayAssignments = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return assignments.find(
      (a) => new Date(a.date).toISOString().split('T')[0] === dateStr
    );
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Weekly Plan</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            {weekStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-7">
        {weekDays.map((date, index) => {
          const dayAssignment = getDayAssignments(date);
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`rounded-lg border-2 p-4 ${
                isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500">{daysOfWeek[index]}</p>
                <p className="text-lg font-semibold text-gray-900">{date.getDate()}</p>
              </div>

              {dayAssignment ? (
                <div className="space-y-3">
                  {dayAssignment.meals && dayAssignment.meals.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold text-green-700">Meals</p>
                      <div className="space-y-1">
                        {dayAssignment.meals.slice(0, 2).map((meal: any, i: number) => (
                          <div key={i} className="rounded bg-green-50 p-2 text-xs">
                            <p className="font-medium text-gray-900">{meal.name}</p>
                            <p className="text-gray-600">{meal.mealType}</p>
                          </div>
                        ))}
                        {dayAssignment.meals.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{dayAssignment.meals.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {dayAssignment.exercises && dayAssignment.exercises.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold text-blue-700">Exercises</p>
                      <div className="space-y-1">
                        {dayAssignment.exercises.slice(0, 2).map((exercise: any, i: number) => (
                          <div key={i} className="rounded bg-blue-50 p-2 text-xs">
                            <p className="font-medium text-gray-900">{exercise.name}</p>
                            {exercise.sets && exercise.reps && (
                              <p className="text-gray-600">
                                {exercise.sets}x{exercise.reps}
                              </p>
                            )}
                          </div>
                        ))}
                        {dayAssignment.exercises.length > 2 && (
                          <p className="text-xs text-gray-500">
                            +{dayAssignment.exercises.length - 2} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">No assignments</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

