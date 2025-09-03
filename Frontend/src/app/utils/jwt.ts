import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // email
  role: string;
  id: number;
  iat: number;
  exp: number;
}

export function getCurrentUserId(): string | null {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('No token found');
    return null;
  }

  try {
    const decoded = jwtDecode<any>(token);
    console.log('NEW JWT payload:', decoded);
    console.log('Available keys:', Object.keys(decoded));

    if (decoded.id) {
      console.log('ID found:', decoded.id);
      return decoded.id.toString();
    } else {
      console.log('ID still missing from token');
      return null;
    }
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}
