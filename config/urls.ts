/**
 * Centralized URL Configuration
 * Routes for the Practice Software Testing toolshop demo.
 */
export const URLS = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ACCOUNT: '/account',
    ACCOUNT_FAVORITES: '/account/favorites',
    CHECKOUT: '/checkout',

    /** Product detail route. The SPA loads product data from `GET /api/products/:id`. */
    product: (id: string) => `/product/${id}`,
} as const;
