package com.krupa.SecurityConfig;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // 👈 Make sure this is imported
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class configuration {

    @Value("${spring.security.user.name}")
    private String adminUsername;

    @Value("${spring.security.user.password}")
    private String adminPassword;

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(PasswordEncoder encoder) {
        UserDetails admin = User.builder()
                .username(adminUsername)
                .password(encoder.encode(adminPassword))
                .roles("ADMIN")
                .build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // 1. Allow ALL browser OPTIONS preflight handshakes to pass through
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. PUBLIC CATALOG READ ACCESS (First Match Rules) 🌍
                        // This allows regular users to read catalog listings and images without logging in!
                        .requestMatchers(HttpMethod.GET, "/api/projects/**").permitAll()   // 👈 Open for reading listings
                        .requestMatchers(HttpMethod.GET, "/api/furniture/**").permitAll()  // 👈 Open for reading listings

                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/auth/login").hasRole("ADMIN")

                        // 3. SECURE ADMINISTRATIVE WORKSPACES (Fallback for POST, PUT, DELETE) 🔐
                        // Because the GET rules matched above, only modifications reach these lines!
                        .requestMatchers("/api/expenses/**").hasRole("ADMIN")
                        .requestMatchers("/api/projects/**").hasRole("ADMIN")
                        .requestMatchers("/api/furniture/**").hasRole("ADMIN")

                        // 4. Fallback security net
                        .anyRequest().authenticated()
                )

                // Prevents browser popups for general unauthorized API requests
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Unauthorized access setup\"}");
                        })
                )

                // Prevents the browser popup box specifically during bad login attempts
                .httpBasic(basic -> basic
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Invalid username or password\"}");
                        })
                );

        return http.build();
    }

    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of("http://localhost:4200"));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}