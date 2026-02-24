/**
 * Base error class for all Flaresend SDK errors
 */
export class FlaresendError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public response?: any
    ) {
        super(message);
        this.name = 'FlaresendError';
        Object.setPrototypeOf(this, FlaresendError.prototype);
    }
}

/**
 * Thrown when the API key is invalid or missing
 */
export class AuthenticationError extends FlaresendError {
    constructor(message: string = 'Authentication failed. Please check your API key.', statusCode: number = 401, response?: any) {
        super(message, statusCode, response);
        this.name = 'AuthenticationError';
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}

/**
 * Thrown when the WhatsApp instance is not ready to send messages
 */
export class InstanceNotReadyError extends FlaresendError {
    constructor(message: string, statusCode: number = 425, response?: any) {
        super(message, statusCode, response);
        this.name = 'InstanceNotReadyError';
        Object.setPrototypeOf(this, InstanceNotReadyError.prototype);
    }
}

/**
 * Thrown when there's a validation error in the request parameters
 */
export class ValidationError extends FlaresendError {
    constructor(message: string, statusCode: number = 400, response?: any) {
        super(message, statusCode, response);
        this.name = 'ValidationError';
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * Thrown when the requested resource is not found
 */
export class NotFoundError extends FlaresendError {
    constructor(message: string = 'Resource not found', statusCode: number = 404, response?: any) {
        super(message, statusCode, response);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
