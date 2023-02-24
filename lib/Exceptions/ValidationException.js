import HttpException from '#Exceptions/HttpException.js';

export default class ValidationException extends HttpException {
    constructor(message) {
        super(message, 422);
    }
}
