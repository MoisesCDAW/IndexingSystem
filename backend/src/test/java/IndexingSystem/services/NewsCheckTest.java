package IndexingSystem.services;

import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NewsCheckTest {

    private NewsCheck newsCheck;

    @Mock
    private Document mockDocument;

    @Mock
    private Element mockBody;

    @BeforeEach
    public void setUp() {
        newsCheck = new NewsCheck();
    }

    @Test
    public void testNullUrl() {
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            newsCheck.searchWordsInUrl(null, words);
        });

        assertEquals("URL cannot be null or empty", exception.getMessage());
    }

    @Test
    public void testEmptyUrl() {
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test"));
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            newsCheck.searchWordsInUrl("   ", words);
        });

        assertEquals("URL cannot be null or empty", exception.getMessage());
    }

    @Test
    public void testNullWordsList() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            newsCheck.searchWordsInUrl("http://example.com", null);
        });

        assertEquals("Word list cannot be null", exception.getMessage());
    }

    @Test
    public void testEmptyWordsList() {
        ArrayList<String> words = new ArrayList<>();
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            newsCheck.searchWordsInUrl("http://example.com", words);
        });

        assertEquals("The list of words is empty", exception.getMessage());
    }

    @Test
    public void testEmptyWord() {
        ArrayList<String> words = new ArrayList<>(Arrays.asList("  "));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            newsCheck.searchWordsInUrl("http://example.com", words);
        });

        assertTrue(exception.getMessage().contains("Word cannot be empty"));
    }

    @Test
    public void testInvalidWord() {
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test@123"));
        Exception exception = assertThrows(RuntimeException.class, () -> {
            newsCheck.searchWordsInUrl("http://example.com", words);
        });
        System.out.println(exception.getMessage());
        assertTrue(exception.getMessage().contains("Word not valid:"));
    }

    @Test
    public void testWordFoundInPage() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test"));
        String pageContent = "This is a test page content";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(true, result.get(0));
            assertEquals("test", result.get(1));
        }
    }

    @Test
    public void testWordNotFoundInPage() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("notfound"));
        String pageContent = "This is a test page content";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(false, result.get(0));
            assertEquals("", result.get(1));
        }
    }

    @Test
    public void testMultipleWords_FirstWordFound() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test", "notfound"));
        String pageContent = "This is a test page content";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(true, result.get(0));
            assertEquals("test", result.get(1));
        }
    }

    @Test
    public void testMultipleWords_SecondWordFound() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("notfound", "page"));
        String pageContent = "This is a test page content";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(true, result.get(0));
            assertEquals("page", result.get(1));
        }
    }

    @Test
    public void testConnectionError() throws IOException {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("test"));

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenThrow(new IOException("Connection failed"));

            Exception exception = assertThrows(RuntimeException.class, () -> {
                newsCheck.searchWordsInUrl(testUrl, words);
            });

            assertTrue(exception.getMessage().contains("Error connecting to URL"));
        }
    }

    @Test
    public void testCaseInsensitiveSearch() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("TEST"));
        String pageContent = "This is a test page content";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(true, result.get(0));
            assertEquals("test", result.get(1));
        }
    }

    @Test
    public void testValidWord_WithApostrophe() throws Exception {
        String testUrl = "http://example.com";
        ArrayList<String> words = new ArrayList<>(Arrays.asList("don't"));
        String pageContent = "I don't know";

        try (MockedStatic<Jsoup> jsoupMockedStatic = Mockito.mockStatic(Jsoup.class)) {
            Connection mockConnection = mock(Connection.class);
            jsoupMockedStatic.when(() -> Jsoup.connect(anyString())).thenReturn(mockConnection);
            when(mockConnection.get()).thenReturn(mockDocument);
            when(mockDocument.body()).thenReturn(mockBody);
            when(mockBody.text()).thenReturn(pageContent);

            ArrayList<Object> result = newsCheck.searchWordsInUrl(testUrl, words);

            assertEquals(2, result.size());
            assertEquals(true, result.get(0));
            assertEquals("don't", result.get(1));
        }
    }
}