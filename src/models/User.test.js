import { User, Role } from './User';

describe('User Model', () => {
  test('creates user instance with constructor parameters', () => {
    const user = new User('johndoe', 'john@example.com', 'password123', Role.LEARNER, 1);
    
    expect(user.id).toBe(1);
    expect(user.username).toBe('johndoe');
    expect(user.email).toBe('john@example.com');
    expect(user.password).toBe('password123');
    expect(user.role).toBe(Role.LEARNER);
  });

  test('creates user instance with default values', () => {
    const user = new User();
    
    expect(user.id).toBeNull();
    expect(user.username).toBe('');
    expect(user.email).toBe('');
    expect(user.password).toBe('');
    expect(user.role).toBe(Role.LEARNER);
  });

  test('creates instructor user', () => {
    const user = new User('janedoe', 'jane@example.com', 'password456', Role.INSTRUCTOR, 2);
    
    expect(user.role).toBe(Role.INSTRUCTOR);
    expect(user.username).toBe('janedoe');
    expect(user.email).toBe('jane@example.com');
  });

  test('toJSON returns correct object', () => {
    const user = new User('johndoe', 'john@example.com', 'password123', Role.LEARNER, 1);
    
    const json = user.toJSON();
    
    expect(json).toEqual({
      id: 1,
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      role: Role.LEARNER
    });
  });

  test('Role enum has correct values', () => {
    expect(Role.LEARNER).toBe('LEARNER');
    expect(Role.INSTRUCTOR).toBe('INSTRUCTOR');
    expect(Role.ADMIN).toBe('ADMIN');
  });

  test('handles different role values', () => {
    const adminUser = new User('admin', 'admin@example.com', 'admin123', Role.ADMIN, 3);
    
    expect(adminUser.role).toBe('ADMIN');
  });

  test('preserves all constructor parameters', () => {
    const user = new User('testuser', 'test@example.com', 'testpass', Role.INSTRUCTOR, 999);
    
    expect(user.username).toBe('testuser');
    expect(user.email).toBe('test@example.com');
    expect(user.password).toBe('testpass');
    expect(user.role).toBe(Role.INSTRUCTOR);
    expect(user.id).toBe(999);
  });
}); 