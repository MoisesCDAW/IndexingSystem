package IndexingSystem.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new SpaResolver());
    }

    private static class SpaResolver implements ResourceResolver {
        private final Resource indexHtml = new ClassPathResource("/static/index.html");

        @Override
        public Resource resolveResource(HttpServletRequest request, String requestPath,
                List<? extends Resource> locations, ResourceResolverChain chain) {
            if (requestPath.startsWith("api/")) {
                return null;
            }
            Resource resource = chain.resolveResource(request, requestPath, locations);
            return resource != null ? resource : indexHtml;
        }

        @Override
        public String resolveUrlPath(String resourcePath, List<? extends Resource> locations,
                ResourceResolverChain chain) {
            if (resourcePath.startsWith("api/")) {
                return null;
            }

            String resolved = chain.resolveUrlPath(resourcePath, locations);
            return resolved != null ? resolved : resourcePath;
        }
    }
}