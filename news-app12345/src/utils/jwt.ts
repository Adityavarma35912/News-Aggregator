// --- JWT Utility ---
export const setToken = (token: string) => {
    localStorage.setItem('jwt_token', token);
};

export const getToken = (): string | null => {
    return localStorage.getItem('jwt_token');
};

export const removeToken = () => {
    localStorage.removeItem('jwt_token');
};

export const decodeToken = (token: string): any => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}; 