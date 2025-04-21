package IndexingSystem.component.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.jsoup.Connection;
import org.jsoup.nodes.Document;

import java.util.ArrayList;

class NewsCheckTest {

    // Test 1: Verify that an exception is thrown if the list of words is empty
    @Test
    void testSearchWordsInUrlWithEmptyList() {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>(); // Empty list

        // Act & Assert
        Exception exception = assertThrows(RuntimeException.class, () -> {
            newsCheck.searchWordsInUrl("http://example.com", words);
        });

        // Verify that the exception contains the expected message
        String expectedMessage = "Error getting page content";
        String actualMessage = exception.getMessage();

        assertTrue(actualMessage.contains(expectedMessage));
        assertTrue(actualMessage.contains("IllegalArgumentException"));
    }

    // Test 2: Verify if the URL contains the word
    @Test
    void testSearchWordsInUrlWithWordFound() throws Exception {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>();
        words.add("example");

        // Mock to simulate Jsoup response
        Document mockDocument = mock(Document.class);
        when(mockDocument.body()).thenReturn(mock(org.jsoup.nodes.Element.class));
        when(mockDocument.body().text()).thenReturn("This is an example text");

        // Mock to simulate the connection
        Connection mockConnection = mock(Connection.class);
        when(mockConnection.get()).thenReturn(mockDocument);

        // Act
        ArrayList<Object> aux = new ArrayList<>(newsCheck.searchWordsInUrl("http://example.com", words));
        Boolean result = (Boolean) aux.get(0);

        // Assert
        assertTrue(result); // We expect it to return true since the word "example" is in the text
    }

    // Test 3: Verify that the word is not found
    @Test
    void testSearchWordsInUrlWithWordNotFound() throws Exception {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>();
        words.add("nonexistent");

        // Mock to simulate Jsoup response
        Document mockDocument = mock(Document.class);
        when(mockDocument.body()).thenReturn(mock(org.jsoup.nodes.Element.class));
        when(mockDocument.body().text()).thenReturn("This is a sample text");

        // Mock to simulate the connection
        Connection mockConnection = mock(Connection.class);
        when(mockConnection.get()).thenReturn(mockDocument);

        // Act
        ArrayList<Object> aux = new ArrayList<>(newsCheck.searchWordsInUrl("http://example.com", words));
        Boolean result = (Boolean) aux.get(0);

        // Assert
        assertFalse(result);
    }
}
