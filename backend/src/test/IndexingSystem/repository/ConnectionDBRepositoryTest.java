package IndexingSystem.repository;

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

    // test 1: test the constructor
    @Test
    void testGettersAndSetters() {
        assertEquals("jdbc:h2:mem:testdb", connectionDBRepository.getUrl());
        assertEquals("org.h2.Driver", connectionDBRepository.getDriverClassName());
        assertEquals("sa", connectionDBRepository.getUsername());
        assertEquals("", connectionDBRepository.getPassword());
    }

    // test 2: test the getConnection method
    @Test
    void testGetConnectionSuccess() {
        try (MockedStatic<DriverManager> driverManagerMock = Mockito.mockStatic(DriverManager.class)) {
            Connection mockConnection = mock(Connection.class);
            driverManagerMock.when(() -> DriverManager.getConnection(anyString(), anyString(), anyString()))
                    .thenReturn(mockConnection);

            Connection connection = connectionDBRepository.getConnection();
            assertNotNull(connection);
        }
    }

    // test 3: test the getConnection method when DriverManager returns null
    @Test
    void testGetConnectionFailure() {
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
