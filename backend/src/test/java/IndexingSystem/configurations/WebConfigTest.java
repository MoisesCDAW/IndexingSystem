package IndexingSystem.configurations;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.resource.ResourceResolverChain;

import jakarta.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WebConfigTest {

    @Mock
    private ResourceHandlerRegistry registry;

    @Mock
    private HttpServletRequest request;

    @Mock
    private ResourceResolverChain chain;

    @Mock
    private Resource resource;

    private List<Resource> locations;

    @BeforeEach
    public void setUp() {
        locations = new ArrayList<>();
        locations.add(new ClassPathResource("/static/"));
    }

    @Test
    public void testResolveResource_ApiPath() throws Exception {
        // Acceder a la clase interna SpaResolver usando reflexión
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        Resource result = invokeResolveResource(spaResolver, "api/test", locations);

        // Verificar
        assertNull(result);
        verify(chain, never()).resolveResource(any(), anyString(), any());
    }

    @Test
    public void testResolveResource_ExistingResource() throws Exception {
        // Preparar
        when(chain.resolveResource(any(), anyString(), any())).thenReturn(resource);
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        Resource result = invokeResolveResource(spaResolver, "js/app.js", locations);

        // Verificar
        assertNotNull(result);
        assertEquals(resource, result);
        verify(chain).resolveResource(any(), eq("js/app.js"), any());
    }

    @Test
    public void testResolveResource_NonExistingResource() throws Exception {
        // Preparar
        when(chain.resolveResource(any(), anyString(), any())).thenReturn(null);
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        Resource result = invokeResolveResource(spaResolver, "non-existing.js", locations);

        // Verificar
        assertNotNull(result);
        assertTrue(result instanceof ClassPathResource);
        ClassPathResource classPathResource = (ClassPathResource) result;
        assertEquals("static/index.html", classPathResource.getPath());
        verify(chain).resolveResource(any(), eq("non-existing.js"), any());
    }

    @Test
    public void testResolveUrlPath_ApiPath() throws Exception {
        // Acceder a la clase interna SpaResolver usando reflexión
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        String result = invokeResolveUrlPath(spaResolver, "api/test", locations);

        // Verificar
        assertNull(result);
        verify(chain, never()).resolveUrlPath(anyString(), any());
    }

    @Test
    public void testResolveUrlPath_ExistingPath() throws Exception {
        // Preparar
        when(chain.resolveUrlPath(anyString(), any())).thenReturn("resolved/path");
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        String result = invokeResolveUrlPath(spaResolver, "js/app.js", locations);

        // Verificar
        assertEquals("resolved/path", result);
        verify(chain).resolveUrlPath(eq("js/app.js"), any());
    }

    @Test
    public void testResolveUrlPath_NonExistingPath() throws Exception {
        // Preparar
        when(chain.resolveUrlPath(anyString(), any())).thenReturn(null);
        Object spaResolver = createSpaResolverInstance();

        // Ejecutar
        String result = invokeResolveUrlPath(spaResolver, "non-existing.js", locations);

        // Verificar
        assertEquals("non-existing.js", result);
        verify(chain).resolveUrlPath(eq("non-existing.js"), any());
    }

    // Métodos auxiliares para acceder a la clase interna SpaResolver

    private Object createSpaResolverInstance() throws Exception {
        Class<?> spaResolverClass = Class.forName("IndexingSystem.configurations.WebConfig$SpaResolver");
        return spaResolverClass.getDeclaredConstructor().newInstance();
    }

    private Resource invokeResolveResource(Object spaResolver, String requestPath, List<Resource> locations)
            throws Exception {
        Class<?> spaResolverClass = spaResolver.getClass();
        return (Resource) spaResolverClass
                .getMethod("resolveResource", HttpServletRequest.class, String.class, List.class,
                        ResourceResolverChain.class)
                .invoke(spaResolver, request, requestPath, locations, chain);
    }

    private String invokeResolveUrlPath(Object spaResolver, String resourcePath, List<Resource> locations)
            throws Exception {
        Class<?> spaResolverClass = spaResolver.getClass();
        return (String) spaResolverClass
                .getMethod("resolveUrlPath", String.class, List.class, ResourceResolverChain.class)
                .invoke(spaResolver, resourcePath, locations, chain);
    }
}