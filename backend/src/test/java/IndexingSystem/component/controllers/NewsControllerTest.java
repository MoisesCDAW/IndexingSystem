package IndexingSystem.component.controllers;

import IndexingSystem.component.models.News;
import IndexingSystem.component.repository.H2Repository;
import IndexingSystem.component.services.NewsCheck;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class NewsControllerTest {

    @InjectMocks
    private NewsController newsController;

    @Mock
    private H2Repository h2Repository;

    @Mock
    private NewsCheck newsCheck;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllNews() {
        // Arrange
        List<News> newsList = new ArrayList<>();
        newsList.add(new News());
        try {
            when(h2Repository.readAll()).thenReturn(newsList);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.GetAllNews();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void testGetNewsFound() {
        // Arrange
        Map<String, String> entity = Map.of("url", "http://example.com");
        News news = new News();
        try {
            when(h2Repository.read("http://example.com")).thenReturn(news);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.getNews(entity);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testGetNewsNotFound() {
        // Arrange
        Map<String, String> entity = Map.of("url", "http://example.com");
        try {
            when(h2Repository.read("http://example.com")).thenReturn(null);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.getNews(entity);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testPostNewsWordFound() {
        // Arrange
        Map<String, Object> entity = Map.of("url", "http://example.com", "words", new ArrayList<>());
        try {
            when(newsCheck.searchWordsInUrl(anyString(), any())).thenReturn(new ArrayList<>(List.of(true, "word")));
            when(h2Repository.create(any(News.class), anyBoolean())).thenReturn(1);

            when(h2Repository.create(any(News.class), anyBoolean())).thenReturn(0);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.postNews(entity);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void testPostNewsWordNotFound() {
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(new MockHttpServletRequest()));

        // Arrange
        Map<String, Object> entity = Map.of("url", "http://example.com", "words", new ArrayList<String>());
        try {
            when(newsCheck.searchWordsInUrl(anyString(), any())).thenReturn(new ArrayList<>(List.of(false, "word")));
            when(h2Repository.create(any(News.class), anyBoolean())).thenReturn(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.postNews(entity);

        // Assert
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testPostNewsConflict() {
        // Arrange
        Map<String, Object> entity = Map.of("url", "http://example.com", "words", new ArrayList<String>());
        try {
            when(newsCheck.searchWordsInUrl(anyString(), any(ArrayList.class))).thenReturn(
                    new ArrayList<>(List.of(false, "word")));
            when(h2Repository.create(any(News.class), anyBoolean())).thenReturn(0);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.postNews(entity);

        // Assert
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
    }

    @Test
    void testDeleteNewsFound() {
        // Arrange
        Map<String, String> entity = Map.of("url", "http://example.com");
        try {
            when(h2Repository.delete("http://example.com")).thenReturn(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.deleteNews(entity);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDeleteNewsNotFound() {
        // Arrange
        Map<String, String> entity = Map.of("url", "http://example.com");
        try {
            when(h2Repository.delete("http://example.com")).thenReturn(0);
        } catch (Exception e) {
            e.printStackTrace();
        }

        // Act
        ResponseEntity<?> response = newsController.deleteNews(entity);

        // Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testGetAllNewsError() {
        try {
            when(h2Repository.readAll()).thenThrow(new RuntimeException("Database error"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseEntity<?> response = newsController.GetAllNews();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.toString().contains("Error getting all news"));
    }

    @Test
    void testGetNewsError() {
        Map<String, String> entity = Map.of("url", "http://example.com");

        try {
            when(h2Repository.read("http://example.com")).thenThrow(new RuntimeException("Database error"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseEntity<?> response = newsController.getNews(entity);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.toString().contains("Error getting new"));
    }

    @Test
    void testPostNewsCheckWordsError() {
        Map<String, Object> entity = Map.of("url", "http://example.com", "words", new ArrayList<String>());

        try {
            when(newsCheck.searchWordsInUrl(anyString(), any())).thenThrow(new RuntimeException("Check error"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseEntity<?> response = newsController.postNews(entity);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
    }

    @Test
    void testPostNewsCreateError() {
        Map<String, Object> entity = Map.of("url", "http://example.com", "words", new ArrayList<String>());

        try {
            when(newsCheck.searchWordsInUrl(anyString(), any())).thenReturn(new ArrayList<>(List.of(false, "word")));
            when(h2Repository.create(any(News.class), anyBoolean())).thenThrow(new RuntimeException("DB error"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseEntity<?> response = newsController.postNews(entity);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.toString().contains("Error creating new"));
    }

    @Test
    void testDeleteNewsError() {
        Map<String, String> entity = Map.of("url", "http://example.com");

        try {
            when(h2Repository.delete("http://example.com")).thenThrow(new RuntimeException("Database error"));
        } catch (Exception e) {
            e.printStackTrace();
        }

        ResponseEntity<?> response = newsController.deleteNews(entity);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.toString().contains("Error deleting new"));
    }

}
