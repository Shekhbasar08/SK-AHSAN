package com.kaamconnect.config;

import com.kaamconnect.common.Role;
import com.kaamconnect.service.ServiceCategory;
import com.kaamconnect.service.ServiceCategoryRepository;
import com.kaamconnect.user.User;
import com.kaamconnect.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataSeeder {

    @Bean
    CommandLineRunner seedData(ServiceCategoryRepository categoryRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (categoryRepository.count() == 0) {
                String[][] cats = {
                        { "Electrician", "Wiring, fans, switches & repairs", "zap", "299" },
                        { "Plumber", "Leaks, taps, pipes & fittings", "droplets", "349" },
                        { "Carpenter", "Furniture, doors & fittings", "hammer", "399" },
                        { "AC Technician", "AC service, gas refill & repair", "wind", "499" },
                        { "Painter", "Wall painting & polishing", "paintbrush", "449" },
                        { "Cleaner", "Deep home & kitchen cleaning", "sparkles", "499" },
                        { "Mechanic", "Two & four wheeler repairs", "wrench", "399" },
                        { "Appliance Repair", "Fridge, washing machine & more", "washingmachine", "349" },
                };
                for (String[] c : cats) {
                    ServiceCategory sc = new ServiceCategory();
                    sc.setName(c[0]);
                    sc.setDescription(c[1]);
                    sc.setIcon(c[2]);
                    sc.setBasePrice(Double.parseDouble(c[3]));
                    categoryRepository.save(sc);
                }
            }
            if (userRepository.count() == 0) {
                User admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@kaamconnect.in");
                admin.setPasswordHash(passwordEncoder.encode("admin123"));
                admin.setPhone("+91 90000 00001");
                admin.setRole(Role.ADMIN);
                admin.setCreatedAt(LocalDate.now().toString());
                userRepository.save(admin);

                User customer = new User();
                customer.setName("Demo Customer");
                customer.setEmail("customer@demo.com");
                customer.setPasswordHash(passwordEncoder.encode("password123"));
                customer.setPhone("+91 98765 43210");
                customer.setRole(Role.CUSTOMER);
                customer.setCreatedAt(LocalDate.now().toString());
                userRepository.save(customer);

                User worker = new User();
                worker.setName("Ramesh Kumar");
                worker.setEmail("worker@demo.com");
                worker.setPasswordHash(passwordEncoder.encode("password123"));
                worker.setPhone("+91 98200 11223");
                worker.setRole(Role.WORKER);
                worker.setCreatedAt(LocalDate.now().toString());
                userRepository.save(worker);
            }
        };
    }
}
