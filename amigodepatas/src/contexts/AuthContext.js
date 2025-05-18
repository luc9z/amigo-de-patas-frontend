'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/api';

export const AuthContext = createContext({});

// Função para decodificar o token JWT
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const decoded = JSON.parse(jsonPayload);
    console.log('Token decodificado:', decoded);
    return decoded;
  } catch (error) {
    console.error('Erro ao decodificar token:', error);
    return null;
  }
};

// Função para extrair a role principal do token
const extractRole = (decodedToken) => {
  if (!decodedToken) return 'ROLE_USER';
  
  // Se tiver roles como array, pega a primeira role
  if (decodedToken.roles && Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) {
    return decodedToken.roles[0];
  }
  
  // Se tiver role como string
  if (decodedToken.role) {
    return decodedToken.role;
  }
  
  return 'ROLE_USER';
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (token && storedUser) {
            try {
                const decodedToken = decodeToken(token);
                const userData = JSON.parse(storedUser);
                
                // Adiciona a role do token ao userData
                const role = extractRole(decodedToken);
                userData.role = role;
                setUserRole(role);
                console.log('Role do usuário carregada:', role);
                
                setUser(userData);
                console.log('Usuário carregado:', userData);
            } catch (error) {
                console.error('Erro ao carregar usuário:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
    }, []);

    const login = async (email, senha) => {
        const response = await authService.login(email, senha);
        const decodedToken = decodeToken(response.token);
        const role = extractRole(decodedToken);
        
        const userData = {
            token: response.token,
            nome: response.nome,
            email: response.email,
            id: response.id,
            role: role
        };
        
        console.log('Login realizado - Role do usuário:', role);
        console.log('Dados completos do usuário:', userData);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setUserRole(role);
        window.location.href = '/';
    };

    const logout = () => {
        console.log('Logout realizado - Role anterior:', userRole);
        authService.logout();
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        setUserRole(null);
    };

    const updateUser = async (userData) => {
        try {
            const response = await authService.updateUser(userData);
            const updatedUser = { ...user, ...response };
            console.log('Usuário atualizado - Role atual:', updatedUser.role);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            return response;
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    };

    // Log quando a role muda
    useEffect(() => {
        console.log('Role do usuário atualizada:', userRole);
    }, [userRole]);

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

export default useAuth;