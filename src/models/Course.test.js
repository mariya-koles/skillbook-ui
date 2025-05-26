import { Course } from './Course';

describe('Course Model', () => {
  test('creates course instance with constructor parameters', () => {
    const course = new Course(
      1,
      'React Fundamentals',
      'Learn the basics of React',
      'A comprehensive course covering React components, state, props, and hooks.',
      'Programming',
      120,
      { firstName: 'John', lastName: 'Doe' },
      '2024-01-15T10:00:00Z'
    );
    
    expect(course.id).toBe(1);
    expect(course.title).toBe('React Fundamentals');
    expect(course.description).toBe('Learn the basics of React');
    expect(course.longDescription).toBe('A comprehensive course covering React components, state, props, and hooks.');
    expect(course.category).toBe('Programming');
    expect(course.durationMinutes).toBe(120);
    expect(course.instructor).toEqual({ firstName: 'John', lastName: 'Doe' });
    expect(course.startTime).toBe('2024-01-15T10:00:00Z');
  });

  test('creates course instance with default values', () => {
    const course = new Course();
    
    expect(course.id).toBeNull();
    expect(course.title).toBe('');
    expect(course.description).toBe('');
    expect(course.longDescription).toBe('');
    expect(course.category).toBe('');
    expect(course.durationMinutes).toBe(0);
    expect(course.instructor).toBeNull();
    expect(course.startTime).toBeNull();
  });

  test('getFormattedDuration returns correct format for hours and minutes', () => {
    const course = new Course(1, 'Test', '', '', '', 150); // 2.5 hours
    
    expect(course.getFormattedDuration()).toBe('2 hours 30 minutes');
  });

  test('getFormattedDuration returns correct format for whole hours', () => {
    const course = new Course(1, 'Test', '', '', '', 120); // 2 hours
    
    expect(course.getFormattedDuration()).toBe('2 hours');
  });

  test('getFormattedDuration returns correct format for minutes only', () => {
    const course = new Course(1, 'Test', '', '', '', 45); // 45 minutes
    
    expect(course.getFormattedDuration()).toBe('45 minutes');
  });

  test('getFormattedDuration handles zero duration', () => {
    const course = new Course(1, 'Test', '', '', '', 0);
    
    expect(course.getFormattedDuration()).toBe('0 minutes');
  });

  test('getFormattedStartTime returns correct format', () => {
    const course = new Course(1, 'Test', '', '', '', 0, null, '2024-01-15T10:00:00Z');
    
    const result = course.getFormattedStartTime();
    
    // The exact format depends on the user's locale, but it should be a string
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
    expect(result).toContain('January');
    expect(result).toContain('2024');
  });

  test('getFormattedStartTime handles invalid date', () => {
    const course = new Course(1, 'Test', '', '', '', 0, null, 'invalid-date');
    
    expect(course.getFormattedStartTime()).toBe('TBD');
  });

  test('getFormattedStartTime handles null startTime', () => {
    const course = new Course(1, 'Test', '', '', '', 0, null, null);
    
    expect(course.getFormattedStartTime()).toBe('TBD');
  });

  test('toJSON returns correct object', () => {
    const course = new Course(
      1,
      'React Fundamentals',
      'Learn React',
      'Long description',
      'Programming',
      120,
      { firstName: 'John', lastName: 'Doe' },
      '2024-01-15T10:00:00Z'
    );
    
    const json = course.toJSON();
    
    expect(json).toEqual({
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn React',
      longDescription: 'Long description',
      category: 'Programming',
      durationMinutes: 120,
      instructor: { firstName: 'John', lastName: 'Doe' },
      startTime: '2024-01-15T10:00:00Z'
    });
  });

  test('fromJSON creates course from JSON data', () => {
    const jsonData = {
      id: 1,
      title: 'React Fundamentals',
      description: 'Learn React',
      longDescription: 'Long description',
      category: 'Programming',
      durationMinutes: 120,
      instructor: { firstName: 'John', lastName: 'Doe' },
      startTime: '2024-01-15T10:00:00Z'
    };
    
    const course = Course.fromJSON(jsonData);
    
    expect(course.id).toBe(1);
    expect(course.title).toBe('React Fundamentals');
    expect(course.description).toBe('Learn React');
    expect(course.durationMinutes).toBe(120);
  });

  test('fromJSON handles array startTime format', () => {
    const jsonData = {
      id: 1,
      title: 'Test Course',
      description: 'Test',
      durationMinutes: 60,
      startTime: [2024, 1, 15, 10, 0] // Java LocalDateTime format
    };
    
    const course = Course.fromJSON(jsonData);
    
    // Check that it's a valid ISO string containing the date
    expect(course.startTime).toMatch(/2024-01-15T\d{2}:00:00/);
  });

  test('duration formatting with large numbers', () => {
    const course = new Course(1, 'Test', '', '', '', 1440); // 24 hours
    
    expect(course.getFormattedDuration()).toBe('24 hours');
  });

  test('duration formatting with 1 hour', () => {
    const course = new Course(1, 'Test', '', '', '', 60); // 1 hour
    
    expect(course.getFormattedDuration()).toBe('1 hours');
  });

  test('duration formatting with 1 minute', () => {
    const course = new Course(1, 'Test', '', '', '', 1); // 1 minute
    
    expect(course.getFormattedDuration()).toBe('1 minutes');
  });
}); 