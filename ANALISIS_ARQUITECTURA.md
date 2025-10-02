# Análisis Completo de Arquitectura - TechShare

## Índice
1. [Introducción](#introducción)
2. [Arquitectura del Frontend](#arquitectura-del-frontend)
3. [Estructura del Backend (Basado en Spring Boot)](#estructura-del-backend)
4. [Conceptos Clave del Backend](#conceptos-clave-del-backend)
5. [Integración Frontend-Backend](#integración-frontend-backend)
6. [Flujo de Datos y Autenticación](#flujo-de-datos-y-autenticación)

---

## Introducción

**TechShare** es una plataforma de gestión de inventario y préstamos desarrollada para la División de Robótica de AAAIMX. El sistema sigue una arquitectura cliente-servidor moderna con:

- **Frontend**: Next.js 14 con TypeScript y Tailwind CSS
- **Backend**: Spring Boot con Java (puerto 8080)
- **Arquitectura**: REST API con autenticación JWT

---

## Arquitectura del Frontend

### Estructura de Directorios

```
src/
├── app/                      # Aplicación Next.js (App Router)
│   ├── admin/               # Módulos administrativos
│   │   ├── borrowings/     # Gestión de préstamos
│   │   ├── catalog/        # Catálogo de materiales
│   │   ├── inventory/      # Inventario
│   │   ├── movements/      # Movimientos
│   │   ├── requests/       # Solicitudes
│   │   ├── roles/          # Gestión de roles
│   │   └── users/          # Gestión de usuarios
│   ├── infraestructure/    # Configuración de infraestructura
│   │   └── config/
│   │       └── configAPI.ts  # Endpoints del API
│   ├── login/              # Página de inicio de sesión
│   ├── register/           # Página de registro
│   └── layout.tsx          # Layout principal
├── components/             # Componentes reutilizables
│   ├── AdminCrud/         # Componentes CRUD administrativos
│   ├── Buttons/           # Botones personalizados
│   ├── Dropdowns/         # Menús desplegables
│   ├── Inputs/            # Campos de entrada
│   ├── Modal/             # Modales
│   ├── NavBar/            # Barra de navegación
│   └── SideNav/           # Navegación lateral
├── hooks/                 # Custom React Hooks
│   ├── useAuth.ts         # Hook de autenticación
│   ├── useCrudOperations.tsx  # Hook para operaciones CRUD
│   ├── useForm.ts         # Hook para manejo de formularios
│   └── useReactCrop.ts    # Hook para recorte de imágenes
├── services/              # Servicios y utilidades
│   ├── Auth/
│   │   └── AuthService.ts    # Servicio de autenticación
│   ├── fetchData.ts          # Función genérica de fetch
│   ├── fetchWithAuth.ts      # Fetch con autenticación
│   └── storageService.ts     # Gestión de localStorage
└── styles/               # Estilos CSS globales
```

### Componentes Clave del Frontend

#### 1. **configAPI.ts** - Configuración de Endpoints
```typescript
const BASE_URL = 'http://localhost:8080'
```
Este archivo centraliza todos los endpoints del API. Define rutas para:
- Categorías y subcategorías
- Materiales
- Roles y usuarios
- Movimientos y préstamos
- Autenticación (login, registro)

**Propósito**: Mantener una única fuente de verdad para URLs del backend, facilitando cambios de configuración.

#### 2. **Interfaces/Types** (Similar a DTOs del Backend)

Las interfaces TypeScript definen la estructura de datos que se envían y reciben:

```typescript
// Role.ts
export type Role = {
    roleId: number;
    name: string;
};

// Material.ts
export type Material = {
    materialsId: number;
    imagePath: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    borrowable_stock: number;
    subCategoryId: number;
    subCategoryName: string;
    roleIds: number[];
    roleNames: string[];
};
```

**Equivalente Backend**: Estas interfaces corresponden a los DTOs (Data Transfer Objects) del backend.

#### 3. **Services** - Capa de Servicios

##### AuthService.ts
Maneja la autenticación del usuario:
```typescript
export const loginUser = async (email: string, password: string)
```
- Realiza petición POST a `/login`
- Extrae el token JWT del header `Authorization`
- Almacena el token y extrae claims (id, user_name)

##### fetchData.ts
Función genérica para peticiones GET:
```typescript
const fetchData = async (url: any, token: any)
```
- Añade el token de autorización en headers
- Maneja respuestas 204 (No Content)
- Invierte el orden de resultados (más antiguos primero)

##### storageService.ts
Gestiona el almacenamiento local (localStorage):
- `setTokenWithClaims()`: Guarda token JWT y extrae claims
- `getToken()`, `getUserId()`, `getUserEmail()`: Recupera datos
- `clearStorage()`: Limpia datos de sesión

#### 4. **Custom Hooks**

##### useAuth.ts
Hook de protección de rutas:
```typescript
export const useAuth = () => {
  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
    }
  }, [router]);
}
```
**Propósito**: Verifica autenticación y redirige a login si no hay token.

##### useCrudOperations.tsx
Hook para operaciones CRUD:
```typescript
export const useCrudOperations = (token: string, refreshData: () => void)
```
Proporciona:
- `handleCreate()`: POST para crear recursos
- `handleUpdate()`: PUT para actualizar recursos
- `handleDelete()`: DELETE para eliminar recursos

**Manejo especial**: Detecta si los datos son FormData (para imágenes) o JSON.

#### 5. **Páginas y Flujos**

##### Login (`/login/page.tsx`)
1. Usuario ingresa email y password
2. Llama a `loginUser()` del AuthService
3. Recibe token JWT en el header Authorization
4. Guarda token y redirige a `/admin/`

##### Register (`/register/page.tsx`)
1. Usuario completa formulario de registro
2. POST a `/register` con:
   ```json
   {
     "user_name": "generado del email",
     "first_name": "nombre",
     "last_name": "apellido",
     "email": "email",
     "password": "contraseña",
     "roles": [1, 2]
   }
   ```

##### Admin Pages (e.g., `/admin/roles/page.tsx`)
Patrón común en páginas CRUD:
1. `useAuth()` - Verifica autenticación
2. `fetchRoles()` - Obtiene datos del backend
3. CRUD UI con modales para crear/editar
4. `useCrudOperations()` - Maneja operaciones

---

## Estructura del Backend (Basado en Spring Boot)

Aunque este es un repositorio frontend, basándonos en los endpoints y el archivo `WebSecurityConfig.java` proporcionado, el backend sigue la arquitectura estándar de Spring Boot:

```
Back-End-TechShare-Java/
└── src/main/java/com/techmate/techmate/
    ├── Config/              # Configuración general
    ├── DTO/                 # Data Transfer Objects
    ├── Entity/              # Entidades JPA (modelos de BD)
    ├── Repository/          # Interfaces de acceso a datos
    ├── Security/            # Configuración de seguridad
    │   └── WebSecurityConfig.java
    ├── Service/             # Lógica de negocio
    │   └── impl/           # Implementaciones de servicios
    └── Controller/          # Controladores REST (endpoints)
```

---

## Conceptos Clave del Backend

### 1. **CONFIG** (Configuración)

**Propósito**: Clases de configuración de Spring Boot que definen beans y comportamientos de la aplicación.

**Ejemplo típico**:
```java
@Configuration
public class AppConfig {
    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
```

**Uso común**:
- Configuración de CORS
- Configuración de base de datos
- Beans de utilidades (ModelMapper, ObjectMapper)
- Configuración de servicios externos

### 2. **DTO** (Data Transfer Objects)

**Propósito**: Objetos que definen la estructura de datos que viajan entre frontend y backend.

**Ventajas**:
- Desacopla la estructura interna (Entity) de la API pública
- Permite validación de datos con anotaciones
- Control sobre qué datos se exponen

**Ejemplo**:
```java
public class RoleDTO {
    @NotNull
    private Long roleId;
    
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;
    
    // Getters y setters
}
```

**Mapeo DTO ↔ Entity**: Se usa ModelMapper o mapeo manual.

### 3. **ENTITY** (Entidades JPA)

**Propósito**: Clases que representan tablas de la base de datos usando JPA (Java Persistence API).

**Ejemplo**:
```java
@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
    
    // Getters, setters, constructores
}
```

**Anotaciones comunes**:
- `@Entity`: Marca la clase como entidad JPA
- `@Table`: Especifica nombre de tabla
- `@Id`: Clave primaria
- `@GeneratedValue`: Auto-incremento
- `@Column`: Configuración de columnas
- `@ManyToMany`, `@OneToMany`, `@ManyToOne`: Relaciones

### 4. **REPOSITORY** (Repositorios)

**Propósito**: Interfaces que extienden `JpaRepository` para acceso a datos. Spring Data JPA genera automáticamente implementaciones.

**Ejemplo**:
```java
@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
    
    @Query("SELECT r FROM Role r WHERE r.name LIKE %:keyword%")
    List<Role> searchByName(@Param("keyword") String keyword);
}
```

**Métodos automáticos**:
- `findAll()`: Obtener todos
- `findById(id)`: Buscar por ID
- `save(entity)`: Guardar/actualizar
- `deleteById(id)`: Eliminar
- Query methods: Spring genera consultas basándose en nombres de métodos

### 5. **SECURITY** (Seguridad)

#### WebSecurityConfig.java

**Propósito**: Configura la seguridad de la aplicación con Spring Security.

**Componentes típicos**:

```java
@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()  // Deshabilita CSRF para APIs REST
            .authorizeRequests()
                .antMatchers("/login", "/register").permitAll()  // Rutas públicas
                .antMatchers("/admin/**").hasRole("ADMIN")       // Rutas protegidas
                .anyRequest().authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)  // Sin sesiones
            .and()
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public JwtAuthenticationFilter jwtAuthFilter() {
        return new JwtAuthenticationFilter();
    }
}
```

**Elementos clave**:
1. **CSRF Disabled**: APIs REST no usan cookies, usan tokens
2. **Autorización por rutas**: Define qué roles acceden a qué endpoints
3. **Stateless Sessions**: No mantiene sesión en servidor (usa JWT)
4. **JWT Filter**: Filtro que valida el token en cada petición

### 6. **SERVICE** (Servicios)

**Propósito**: Contiene la lógica de negocio de la aplicación.

**Estructura típica**:
```
Service/
├── RoleService.java         # Interfaz del servicio
└── impl/
    └── RoleServiceImpl.java # Implementación
```

**Ejemplo de interfaz**:
```java
public interface RoleService {
    List<RoleDTO> getAllRoles();
    RoleDTO getRoleById(Long id);
    RoleDTO createRole(RoleDTO roleDTO);
    RoleDTO updateRole(Long id, RoleDTO roleDTO);
    void deleteRole(Long id);
}
```

**Ejemplo de implementación**:
```java
@Service
public class RoleServiceImpl implements RoleService {
    
    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private ModelMapper modelMapper;
    
    @Override
    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(role -> modelMapper.map(role, RoleDTO.class))
            .collect(Collectors.toList());
    }
    
    @Override
    public RoleDTO createRole(RoleDTO roleDTO) {
        Role role = modelMapper.map(roleDTO, Role.class);
        Role savedRole = roleRepository.save(role);
        return modelMapper.map(savedRole, RoleDTO.class);
    }
    
    // Más métodos...
}
```

**Responsabilidades**:
- Validación de negocio
- Conversión DTO ↔ Entity
- Llamadas a Repository
- Manejo de excepciones de negocio
- Transacciones con `@Transactional`

### 7. **IMPL** (Implementaciones)

**Propósito**: Carpeta que contiene las implementaciones concretas de las interfaces de Service.

**Patrón**: Separar interfaz de implementación permite:
- Cambiar implementación sin afectar dependencias
- Facilita testing con mocks
- Cumple con principios SOLID (Dependency Inversion)

### 8. **USER** (Entidad de Usuario)

**Propósito**: Entidad especial que representa usuarios del sistema.

**Estructura típica**:
```java
@Entity
@Table(name = "users")
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String userName;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;  // Hasheada con BCrypt
    
    @Column(nullable = false)
    private String phoneNumber;
    
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    
    // Implementación de UserDetails para Spring Security
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.getName()))
            .collect(Collectors.toList());
    }
}
```

**Integración con Security**:
- Implementa `UserDetails` de Spring Security
- `getAuthorities()` convierte roles en autoridades
- El password se encripta con `BCryptPasswordEncoder`

### 9. **VALIDATION** (Validación)

**Propósito**: Anotaciones y validadores personalizados para validar datos.

**Validaciones estándar** (en DTOs):
```java
public class MaterialDTO {
    @NotNull(message = "El ID no puede ser nulo")
    private Long materialsId;
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String name;
    
    @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
    private Double price;
    
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    @Email(message = "Email inválido")
    private String contactEmail;
}
```

**Validadores personalizados**:
```java
// Anotación personalizada
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = UniqueEmailValidator.class)
public @interface UniqueEmail {
    String message() default "Email ya existe";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

// Implementación del validador
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String> {
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public boolean isValid(String email, ConstraintValidatorContext context) {
        return userRepository.findByEmail(email).isEmpty();
    }
}
```

---

## Integración Frontend-Backend

### Flujo de Comunicación

```
Frontend (Next.js)          Backend (Spring Boot)
─────────────────────       ─────────────────────

1. Usuario accede a página
   ↓
2. useAuth() verifica token
   ↓
3. fetchData(endpoint, token) ──→ GET /admin/roles/all
                                   ↓
                                   JwtAuthFilter valida token
                                   ↓
                                   RoleController.getAllRoles()
                                   ↓
                                   RoleService.getAllRoles()
                                   ↓
                                   RoleRepository.findAll()
                                   ↓
                                   Mapeo Entity → DTO
                                   ↓
4. ←─────────────────────────────  JSON con lista de roles
   ↓
5. setData(roles)
   ↓
6. UI renderiza tabla con roles
```

### Endpoints y Controladores

Basándose en `configAPI.ts`, el backend tiene estos controladores:

#### AdminController - Rutas administrativas
```java
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    
    // Categorías
    @GetMapping("/categories/all")
    public ResponseEntity<List<CategoryDTO>> getAllCategories() { }
    
    @PostMapping("/categories/create")
    public ResponseEntity<CategoryDTO> createCategory(@Valid @RequestBody CategoryDTO dto) { }
    
    @PutMapping("/categories/update/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO dto) { }
    
    @DeleteMapping("/categories/delete/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) { }
    
    // Similar para subcategories, materials, roles, users, movements, borrowings
}
```

#### AuthController - Autenticación
```java
@RestController
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest request) {
        // Autenticar usuario
        Authentication auth = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        // Generar token JWT
        String token = jwtService.generateToken(auth);
        
        // Devolver token en header
        return ResponseEntity.ok()
            .header("Authorization", "Bearer " + token)
            .build();
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        userService.registerUser(request);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
```

### Manejo de Autenticación JWT

#### Backend - Generación y Validación

**JwtService.java**:
```java
@Service
public class JwtService {
    
    @Value("${jwt.secret}")
    private String secret;
    
    @Value("${jwt.expiration}")
    private Long expiration;
    
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", ((User) userDetails).getId());
        claims.put("user_name", userDetails.getUsername());
        claims.put("roles", userDetails.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList()));
        
        return Jwts.builder()
            .setClaims(claims)
            .setSubject(userDetails.getUsername())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS512, secret)
            .compact();
    }
    
    public boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public Claims extractClaims(String token) {
        return Jwts.parser()
            .setSigningKey(secret)
            .parseClaimsJws(token)
            .getBody();
    }
}
```

**JwtAuthenticationFilter.java**:
```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    @Autowired
    private JwtService jwtService;
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                   HttpServletResponse response, 
                                   FilterChain filterChain) throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            if (jwtService.validateToken(token)) {
                Claims claims = jwtService.extractClaims(token);
                String username = claims.getSubject();
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities()
                    );
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
```

#### Frontend - Extracción y Almacenamiento

Como vimos en `storageService.ts`, el frontend:
1. Recibe el token del header `Authorization`
2. Decodifica el payload base64
3. Extrae claims (id, user_name)
4. Almacena todo en localStorage

```typescript
// En cada petición autenticada
headers: {
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json"
}
```

---

## Flujo de Datos y Autenticación

### Flujo Completo de Login

```
FRONTEND                        BACKEND
════════                        ═══════

1. Usuario ingresa email/password
   ↓
2. loginUser(email, password)
   POST /login
   Body: { email, password }    →  AuthController.login()
                                   ↓
                                   AuthenticationManager.authenticate()
                                   ↓
                                   UserDetailsService.loadUserByUsername()
                                   ↓
                                   Verificar password con BCrypt
                                   ↓
                                   Si OK: JwtService.generateToken()
                                   ↓
3. ←─────────────────────────────  Response:
   Header: Authorization: Bearer eyJhbGc...
   Status: 200 OK
   ↓
4. setTokenWithClaims(token)
   - Guarda en localStorage
   - Decodifica JWT
   - Extrae id y user_name
   ↓
5. router.push('/admin/')
```

### Flujo de Operación CRUD (Ejemplo: Crear Role)

```
FRONTEND                           BACKEND
════════                           ═══════

1. Usuario completa formulario
   ↓
2. handleCreate(endpoints.roles.create, payload)
   POST /admin/role/create
   Headers: { Authorization: Bearer token }
   Body: { name: "EDITOR" }      →  JwtAuthenticationFilter
                                    ↓ (valida token)
                                    AdminController.createRole()
                                    ↓ @Valid valida DTO
                                    RoleService.createRole()
                                    ↓
                                    RoleServiceImpl.createRole()
                                    - Mapea DTO → Entity
                                    ↓
                                    RoleRepository.save()
                                    ↓ (inserta en BD)
                                    - Mapea Entity → DTO
                                    ↓
3. ←────────────────────────────   Response:
   Body: { roleId: 5, name: "EDITOR" }
   Status: 200 OK
   ↓
4. refreshData()  // Recarga lista
   GET /admin/role/all           →  Similar flow...
   ↓
5. UI actualiza con nuevo role
```

### Seguridad en Endpoints

El backend usa `@PreAuthorize` para proteger endpoints:

```java
// Solo usuarios con rol ADMIN
@PreAuthorize("hasRole('ADMIN')")
@GetMapping("/admin/users/all")
public ResponseEntity<List<UserDTO>> getAllUsers() { }

// Usuario autenticado o ADMIN
@PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
@GetMapping("/user/details")
public ResponseEntity<UserDTO> getUserDetails() { }

// Público
@GetMapping("/public/categories")
public ResponseEntity<List<CategoryDTO>> getPublicCategories() { }
```

El frontend maneja errores de autorización:
```typescript
// En useCrudOperations.tsx
.catch((error) => alert(JSON.stringify(error.message)));
```

---

## Mejores Prácticas Implementadas

### Backend
1. **Separación de capas**: Controller → Service → Repository
2. **DTOs para API**: Nunca expone entidades directamente
3. **Validación**: Usa Bean Validation (@Valid, @NotNull, etc.)
4. **Seguridad**: JWT stateless, protección por roles
5. **Transacciones**: @Transactional en operaciones de escritura

### Frontend
1. **Hooks personalizados**: Reutilización de lógica (useAuth, useCrudOperations)
2. **Centralización de endpoints**: Un solo lugar (configAPI.ts)
3. **TypeScript**: Types e interfaces para type safety
4. **Componentes reutilizables**: AdminCrud, modales, inputs
5. **Manejo de tokens**: Automático en cada petición

---

## Diagrama de Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                     NAVEGADOR (Cliente)                      │
├─────────────────────────────────────────────────────────────┤
│  Next.js App (puerto 3000)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Hooks     │      │
│  │  (Routes)    │  │  (UI Reusa.) │  │   (Logic)    │      │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘      │
│         │                                     │              │
│  ┌──────▼─────────────────────────────────────▼────────┐   │
│  │              Services Layer                          │   │
│  │  - AuthService    - fetchData                        │   │
│  │  - storageService - useCrudOperations                │   │
│  └──────────────────────┬───────────────────────────────┘   │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP REST (JSON + JWT)
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              Spring Boot Backend (puerto 8080)               │
├─────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────┐    │
│  │         Security Filter Chain                       │    │
│  │  - JwtAuthenticationFilter (valida token)           │    │
│  │  - WebSecurityConfig (reglas de acceso)             │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │              Controllers (REST API)                 │    │
│  │  @RestController - AuthController                   │    │
│  │                  - AdminController                  │    │
│  │                  - UserController                   │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Service Layer (Lógica de Negocio)           │    │
│  │  @Service - RoleService                             │    │
│  │           - UserService                             │    │
│  │           - MaterialService                         │    │
│  │  (Validación, mapeo DTO↔Entity, transacciones)     │    │
│  └────────────────┬───────────────────────────────────┘    │
│                   ▼                                          │
│  ┌────────────────────────────────────────────────────┐    │
│  │        Repository Layer (Acceso a Datos)            │    │
│  │  @Repository - RoleRepository                       │    │
│  │              - UserRepository                       │    │
│  │              - MaterialRepository                   │    │
│  │  (Spring Data JPA - genera queries automáticamente)│    │
│  └────────────────┬───────────────────────────────────┘    │
└───────────────────┼─────────────────────────────────────────┘
                    │ JPA/Hibernate
                    ▼
         ┌──────────────────────┐
         │   Base de Datos      │
         │   (PostgreSQL/MySQL) │
         │                      │
         │  Tables:             │
         │  - users             │
         │  - roles             │
         │  - user_roles        │
         │  - materials         │
         │  - categories        │
         │  - borrowings        │
         │  - movements         │
         └──────────────────────┘
```

---

## Resumen de Conceptos

| Concepto | Ubicación | Propósito |
|----------|-----------|-----------|
| **CONFIG** | Backend/Config/ | Configuración de Spring Boot (beans, CORS, etc.) |
| **DTO** | Backend/DTO/ | Objetos de transferencia para API |
| **ENTITY** | Backend/Entity/ | Modelos JPA que mapean tablas de BD |
| **REPOSITORY** | Backend/Repository/ | Interfaces de acceso a datos (JPA) |
| **SERVICE** | Backend/Service/ | Lógica de negocio |
| **IMPL** | Backend/Service/impl/ | Implementaciones de servicios |
| **SECURITY** | Backend/Security/ | Configuración de autenticación y autorización |
| **USER** | Backend/Entity/User | Entidad de usuario + UserDetails |
| **VALIDATION** | Backend/DTO/ + Validation/ | Validación de datos con anotaciones |
| **Interfaces** | Frontend/interfaces/ | Types de TypeScript (equivalente a DTO) |
| **Services** | Frontend/services/ | Lógica de comunicación con backend |
| **Hooks** | Frontend/hooks/ | Lógica reutilizable de React |
| **configAPI** | Frontend/infraestructure/config/ | Centralización de endpoints |

---

## Conclusión

**TechShare** implementa una arquitectura moderna y escalable:

- **Backend**: Arquitectura en capas con Spring Boot (Controller → Service → Repository → Entity)
- **Frontend**: Aplicación React con Next.js usando hooks personalizados y servicios
- **Seguridad**: JWT stateless con Spring Security
- **Comunicación**: REST API con JSON
- **Validación**: Bean Validation en backend, TypeScript types en frontend
- **Separación**: DTO para API, Entity para BD (nunca se exponen entidades)

Esta estructura permite:
- ✅ Desarrollo paralelo de frontend y backend
- ✅ Facilidad de testing (capas desacopladas)
- ✅ Seguridad robusta con roles y JWT
- ✅ Escalabilidad (agregar nuevos módulos sin afectar existentes)
- ✅ Mantenibilidad (responsabilidades claramente definidas)
