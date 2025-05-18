// User roles enum
export const Role = {
    LEARNER: 'LEARNER',
    INSTRUCTOR: 'INSTRUCTOR',
    ADMIN: 'ADMIN'
};

// User model
export class User {
    constructor(
        username = '',
        email = '',
        password = '',
        role = Role.LEARNER,
        id = null
    ) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // Method to convert to plain object for JSON serialization
    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role
        };
    }
} 