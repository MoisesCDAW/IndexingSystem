package IndexingSystem.component.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.jsoup.Connection;
import org.jsoup.nodes.Document;

import java.util.ArrayList;

class NewsCheckTest {

    // Test 1: Verificar si la lista de palabras está vacía
    @Test
    void testSearchWordsInUrlWithEmptyList() throws Exception {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>(); // Lista vacía

        // Act
        Boolean result = newsCheck.searchWordsInUrl("http://example.com", words);

        // Assert
        assertTrue(result); // Esperamos que retorne true si la lista está vacía
    }

    // Test 2: Verificar si la URL contiene la palabra
    @Test
    void testSearchWordsInUrlWithWordFound() throws Exception {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>();
        words.add("example");

        // Mock para simular la respuesta de Jsoup
        Document mockDocument = mock(Document.class);
        when(mockDocument.body()).thenReturn(mock(org.jsoup.nodes.Element.class));
        when(mockDocument.body().text()).thenReturn("This is an example text");

        // Mock para simular la conexión
        Connection mockConnection = mock(Connection.class);
        when(mockConnection.get()).thenReturn(mockDocument);
        // JsoupConnectionMocker.setConnection(mockConnection); // Método que simula el
        // comportamiento de Jsoup

        // Act
        Boolean result = newsCheck.searchWordsInUrl("http://example.com", words);

        // Assert
        assertTrue(result); // Esperamos que retorne true ya que la palabra "example" está en el texto
    }

    // Test 3: Verificar que no se encuentre la palabra
    @Test
    void testSearchWordsInUrlWithWordNotFound() throws Exception {
        // Arrange
        NewsCheck newsCheck = new NewsCheck();
        ArrayList<String> words = new ArrayList<>();
        words.add("nonexistent");

        // Mock para simular la respuesta de Jsoup
        Document mockDocument = mock(Document.class);
        when(mockDocument.body()).thenReturn(mock(org.jsoup.nodes.Element.class));
        when(mockDocument.body().text()).thenReturn("This is a sample text");

        // Mock para simular la conexión
        Connection mockConnection = mock(Connection.class);
        when(mockConnection.get()).thenReturn(mockDocument);

        // Act
        Boolean result = newsCheck.searchWordsInUrl("http://example.com", words);

        // Assert
        assertFalse(result);
    }
}
