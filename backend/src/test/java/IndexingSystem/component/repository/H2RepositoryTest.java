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

    // test 1: Verify that the table is created
    @Test
    void testCreateTable() throws Exception {
        when(statement.execute(anyString())).thenReturn(true);
        assertDoesNotThrow(() -> h2Repository.createTable());
        verify(statement, times(1)).execute(anyString());
    }

    // test 2: Verify that the readAll method retrieves all news from the database
    @Test
    void testReadAll() throws Exception {
        when(statement.executeQuery(anyString())).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true, false);
        when(resultSet.getString("url")).thenReturn("http://example.com");
        when(resultSet.getBoolean("authorized")).thenReturn(true);

        List<News> newsList = h2Repository.readAll();
        assertEquals(1, newsList.size());
        assertEquals("http://example.com", newsList.get(0).getUrl());
        assertTrue(newsList.get(0).getAuthorized());
    }

    // test 3: Verify that the read method retrieves a single news item from the
    @Test
    void testRead() throws Exception {
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

    // test 4: Verify that the create method inserts a new news item into the
    // database
    @Test
    void testCreate() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(1);
        when(preparedStatement.executeQuery()).thenReturn(resultSet); // read() function
        when(resultSet.next()).thenReturn(false);

        News news = new News("http://example.com", true);
        int result = h2Repository.create(news, false);
        assertEquals(1, result);
    }

    // test 5: Verify that the delete method removes a news item from the database
    @Test
    void testDelete() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(1);

        int result = h2Repository.delete("http://example.com");
        assertEquals(1, result);
    }

    // test 6: Verify that not found news returns null
    @Test
    void testRead_NotFound() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(false);

        News news = h2Repository.read("http://notfound.com");
        assertNull(news);
    }

    // test 7: Verify that the create method returns -2 if the news already exists
    // and the word is found
    @Test
    void testCreate_AlreadyExists() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeQuery()).thenReturn(resultSet);
        when(resultSet.next()).thenReturn(true);

        News news = new News("http://example.com", true);
        int result = h2Repository.create(news, true);
        assertEquals(-2, result);
    }

    // test 8: Verify that the delete method returns 0 if the news is not found
    @Test
    void testDelete_NotFound() throws Exception {
        when(connection.prepareStatement(anyString())).thenReturn(preparedStatement);
        when(preparedStatement.executeUpdate()).thenReturn(0);

        int result = h2Repository.delete("http://notfound.com");
        assertEquals(0, result);
    }

    // test 9: Verify that the create method returns a exception if the news is not
    // found
    @Test
    void testCreateTable_Exception() throws Exception {
        when(statement.execute(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.createTable());
    }

    // test 10: Verify that the readAll method returns a exception if ocurred a
    // error with the database
    @Test
    void testReadAll_Exception() throws Exception {
        when(statement.executeQuery(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.readAll());
    }

    // test 11: Verify that the read method returns a exception if ocurred a error
    // with the database
    @Test
    void testRead_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.read("http://example.com"));
    }

    // test 12: Verify that the create method returns a exception if ocurred a error
    // with the database
    @Test
    void testCreate_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.create(new News("http://example.com", true), true));
    }

    // test 13: Verify that the delete method returns a exception if ocurred a error
    // with the database
    @Test
    void testDelete_Exception() throws Exception {
        when(connection.prepareStatement(anyString())).thenThrow(new RuntimeException("DB Error"));
        assertThrows(RuntimeException.class, () -> h2Repository.delete("http://example.com"));
    }

}
