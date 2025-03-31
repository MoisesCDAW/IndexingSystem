package IndexingSystem.component.repository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import java.sql.Connection;
import java.sql.DriverManager;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

class ConnectionDBRepositoryTest {

    private ConnectionDBRepository connectionDBRepository;

    @BeforeEach
    void setUp() {
        // This method sets up the environment for each test by creating an instance of
        // ConnectionDBRepository
        // and configuring the necessary parameters such as the database URL, driver,
        // username, and password.
        connectionDBRepository = new ConnectionDBRepository();
        connectionDBRepository.setUrl("jdbc:h2:mem:testdb");
        connectionDBRepository.setDriverClassName("org.h2.Driver");
        connectionDBRepository.setUsername("sa");
        connectionDBRepository.setPassword("");
    }

    @Test
    void testGettersAndSetters() {
        // This test verifies that the getter and setter methods of
        // ConnectionDBRepository work correctly.
        // It checks that the values set by the setters are properly retrieved by the
        // getters.
        assertEquals("jdbc:h2:mem:testdb", connectionDBRepository.getUrl());
        assertEquals("org.h2.Driver", connectionDBRepository.getDriverClassName());
        assertEquals("sa", connectionDBRepository.getUsername());
        assertEquals("", connectionDBRepository.getPassword());
    }

    @Test
    void testGetConnectionSuccess() {
        // This test verifies that when DriverManager returns a valid connection, the
        // getConnection() method
        // of ConnectionDBRepository returns a non-null connection.
        try (MockedStatic<DriverManager> driverManagerMock = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            driverManagerMock.when(() -> DriverManager.getConnection(anyString(), anyString(), anyString()))
                    .thenReturn(mockConnection);

            Connection connection = connectionDBRepository.getConnection();
            assertNotNull(connection);
        }
    }

    @Test
    void testGetConnectionFailure() {
        // This test simulates a failure when trying to obtain a database connection,
        // making getConnection()
        // of ConnectionDBRepository return null.
        try (MockedStatic<DriverManager> driverManagerMock = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = null;
            driverManagerMock.when(() -> DriverManager.getConnection(anyString(), anyString(), anyString()))
                    .thenReturn(mockConnection);

            Connection connection = connectionDBRepository.getConnection();
            assertNull(connection);
        }
    }

    @Test
    void testToString() {
        String expected = "ConnectionDB{url='jdbc:h2:mem:testdb', username='sa', password='', driverClassName='org.h2.Driver'}";
        assertEquals(expected, connectionDBRepository.toString());
    }

}
