import { loginUser } from "@/services/Auth/AuthService"
import { sign } from "crypto"

const BASE_URL = 'http://localhost:8080'

const endpoints = {
    categories: {
        getAll: `${BASE_URL}/categories/all`,
        create: `${BASE_URL}/categories/create`,
        update: (id: number) => `${BASE_URL}/categories/update/${id}`,
        delete: (id: number) => `${BASE_URL}/categories/delete/${id}`
    },
    subcategories: {
        getAll: `${BASE_URL}/subcategories/all`,
        create: `${BASE_URL}/subcategories/create`,
        update: (id: number) => `${BASE_URL}/subcategories/update/${id}`,
        delete: (id: number) => `${BASE_URL}/subcategories/delete/${id}`
    },
    materials: {
        getAll: `${BASE_URL}/admin/materials/all`,
        create: `${BASE_URL}/admin/materials/create`,
        update: (id: number) => `${BASE_URL}/admin/materials/update/${id}`,
        delete: (id: number) => `${BASE_URL}/admin/materials/delete/${id}`
    },
    roles: {
        getAll: `${BASE_URL}/admin/role/all`,
        create: `${BASE_URL}/admin/role/create`,
        update: (id: number) => `${BASE_URL}/admin/role/update/${id}`,
        delete: (id: number) => `${BASE_URL}/admin/role/delete/${id}`
    },
    users: {
        getAll: `${BASE_URL}/admin/user/all`,
        update: (id: number) => `${BASE_URL}/admin/users/update/${id}`,
    },
    movements: {
        getAll: `${BASE_URL}/admin/movement/all`,
        create: `${BASE_URL}/admin/movement/create`
    },

    signUp: `${BASE_URL}/register`,
    login: `${BASE_URL}/login`
}

export default endpoints