package IndexingSystem.component.repository;

import java.sql.Connection;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Repository;

@Repository
@ConfigurationProperties(prefix = "spring.datasource")
public class ConnectionDBRepository {
    private String url;
    private String driverClassName;
    private String username;
    private String password;

    public Connection getConnection() {
        Connection connection = null;
        try {
            Class.forName(driverClassName);
            connection = java.sql.DriverManager.getConnection(url, username, password);
        } catch (Exception e) {
            System.out.println("Error getting connection: " + e);
        }
        return connection;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDriverClassName() {
        return driverClassName;
    }

    public void setDriverClassName(String driverClassName) {
        this.driverClassName = driverClassName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "ConnectionDB{" +
                "url='" + url + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", driverClassName='" + driverClassName + '\'' +
                '}';
    }
}
