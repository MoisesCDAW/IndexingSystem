package IndexingSystem.component.repository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import IndexingSystem.component.models.News;

@ExtendWith(MockitoExtension.class)
class H2RepositoryTest {

    @Mock
    private ConnectionDBRepository connectionDBRepository;

    @Mock
    private Connection connection;

    @Mock
    private Statement statement;

    @Mock
    private PreparedStatement preparedStatement;

    @Mock
    private ResultSet resultSet;

    @InjectMocks
    private H2Repository h2Repository;

    @BeforeEach
    void setUp() throws Exception {
        lenient().when(connectionDBRepository.getConnection()).thenReturn(connection);
        lenient().when(connection.createStatement()).thenReturn(statement);
    }

    @Test
    void testCreateTable() throws Exception {
        // This test verifies that the createTable method in H2Repository does not throw
        // any exception when executing a query.
        // It mocks the behavior of statement.execute() to return true, ensuring the
        // method completes successfully.
        when(statement.execute(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> h2Repository.createTable());
        verify(statement, times(1)).execute(anyString());
    }

    @Test
    void testReadAll() throws Exception {
        // This test verifies that the readAll method in H2Repository correctly
        // processes the ResultSet and returns a list of News.
        // It mocks the behavior of ResultSet to return valid data for the "url" and
        // "authorized" fields.
        when(statement.executeQuery(anyString())).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, false);
        when(resultSet.getString("url")).thenReturn("http://example.com");
        when(resultSet.getBoolean("authorized")).thenReturn(true);

        List<News> newsList = h2Repository.readAll();
        assertEquals(1, newsList.size());
        assertEquals("http://example.com", newsList.get(0).getUrl());
        assertTrue(newsList.get(0).getAuthorized());
    }

    @Test
    void testRead() throws Exception {
        // This test verifies that the read method in H2Repository retrieves a single
        // News object from the database based on the URL.
        // It mocks the behavior of ResultSet to return valid data for the "url" and
        // "authorized" fields.
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);
        when(resultSet.getString("url")).thenReturn("http://example.com");
        when(resultSet.getBoolean("authorized")).thenReturn(true);

        News news = h2Repository.read("http://example.com");
        assertNotNull(news);
        assertEquals("http://example.com", news.getUrl());
        assertTrue(news.getAuthorized());
    }

    @Test
    void testCreate() throws Exception {
        // This test verifies that the create method in H2Repository inserts a new News
        // object into the database.
        // It mocks the behavior of PreparedStatement to simulate the insertion of data,
        // returning 1 to indicate success.
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(1);
        when(preparedStatement.executeQuery()).thenReturn(resultSet); // read() function
        when(resultSet.next()).thenReturn(false);

        News news = new News("http://example.com", true);
        int result = h2Repository.create(news);
        assertEquals(1, result);
    }

    @Test
    void testDelete() throws Exception {
        // This test verifies that the delete method in H2Repository removes a News
        // object from the database.
        // It mocks the behavior of PreparedStatement to simulate the deletion process,
        // returning 1 to indicate success.
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(1);

        int result = h2Repository.delete("http://example.com");
        assertEquals(1, result);
    }

    @Test
    void testRead_NotFound() throws Exception {
        // Simula un resultado vacío en el ResultSet
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        News news = h2Repository.read("http://notfound.com");
        assertNull(news);
    }

    @Test
    void testCreate_AlreadyExists() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        News news = new News("http://example.com", true);
        int result = h2Repository.create(news);
        assertEquals(0, result);
    }

    @Test
    void testDelete_NotFound() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(0);

        int result = h2Repository.delete("http://notfound.com");
        assertEquals(0, result);
    }

    @Test
    void testCreateTable_Exception() throws Exception {
        when(statement.execute(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.createTable());
    }

    @Test
    void testReadAll_Exception() throws Exception {
        when(statement.executeQuery(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.readAll());
    }

    @Test
    void testRead_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.read("http://example.com"));
    }

    @Test
    void testCreate_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.create(new News("http://example.com", true)));
    }

    @Test
    void testDelete_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.delete("http://example.com"));
    }

}
