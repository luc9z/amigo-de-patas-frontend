'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/api';

export const AuthContext = createContext({});

// Decode JWT token
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Erro ao decodificar token:', error);
        return null;
    }
};

// Extrair role
const extractRole = (decodedToken) => {
    if (!decodedToken) return 'ROLE_USER';
    if (decodedToken.roles && Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) {
        return decodedToken.roles[0];
    }
    if (decodedToken.role) return decodedToken.role;
    return 'ROLE_USER';
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // 🔄 Carregar dados atualizados do usuário
    const loadUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await authService.getCurrentUser(); // GET /auth/me
            const decoded = decodeToken(token);
            const role = extractRole(decoded);
            const userData = { ...response, role, token };

            setUser(userData);
            setUserRole(role);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
            console.error('Erro ao carregar dados do usuário:', err);
            logout(); // remove se token inválido
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) loadUser();
    }, []);

    const login = async (email, senha) => {
        const response = await authService.login(email, senha);
        localStorage.setItem('token', response.token);
        await loadUser(); // carrega dados reais do usuário após login
        window.location.href = '/';
    };

    const logout = () => {
        authService.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setUserRole(null);
    };

    const updateUser = async (userData) => {
        try {
            await authService.updateUser(userData);
            await loadUser(); // atualiza dados após salvar no backend
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                userRole,
                login,
                logout,
                updateUser,
                isAuthenticated: !!user,
                isAdmin: userRole === 'ROLE_ADMIN',
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
