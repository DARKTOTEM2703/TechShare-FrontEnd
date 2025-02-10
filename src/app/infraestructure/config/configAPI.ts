const BASE_URL = 'http://localhost:8080'

const endpoints = {
    categories: {
        getAll: `${BASE_URL}/admin/categories/all`,
        create: `${BASE_URL}/admin/categories/create`,
        update: (id: number) => `${BASE_URL}/admin/categories/update/${id}`,
        delete: (id: number) => `${BASE_URL}/admin/categories/delete/${id}`
    },
    subcategories: {
        getAll: `${BASE_URL}/admin/subcategories/all`,
        create: `${BASE_URL}/admin/subcategories/create`,
        update: (id: number) => `${BASE_URL}/admin/subcategories/update/${id}`,
        delete: (id: number) => `${BASE_URL}/admin/subcategories/delete/${id}`
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
        update: (id: number) => `${BASE_URL}/admin/user/${id}`,
        getUserDetails: `${BASE_URL}/user/details`,
    },
    movements: {
        getAll: `${BASE_URL}/admin/movement/all`,
        create: `${BASE_URL}/admin/movement/create`
    },
    tokens: {
        getUserId: `${BASE_URL}/tokens/userId`
    },
    borrowings: {
        getAll: `${BASE_URL}/admin/borrow/all`,
        create: `${BASE_URL}/admin/borrow/create`,
        update: (id: number) => `${BASE_URL}/admin/borrow/update/${id}`
    },

    signUp: `${BASE_URL}/register`,
    login: `${BASE_URL}/login`
}

export default endpoints