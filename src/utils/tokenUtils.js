export function extractToken(headerValue) {
    return headerValue.split('Bearer ')[1];
}