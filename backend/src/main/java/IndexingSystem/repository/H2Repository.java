package IndexingSystem.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import IndexingSystem.models.News;

@Repository
public class H2Repository {

    @Autowired
    private ConnectionDBRepository connection;

    public void createTable() throws Exception {
        try {
            connection.getConnection().createStatement().execute(
                    "CREATE TABLE IF NOT EXISTS authorized_news (id INT AUTO_INCREMENT PRIMARY KEY, url VARCHAR(255), authorized BOOLEAN, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public List<News> readAll() throws Exception {
        try {
            ResultSet rs = connection.getConnection().createStatement().executeQuery("SELECT * FROM authorized_news");
            List<News> urls = new ArrayList<News>();

            while (rs.next()) {
                urls.add(new News(rs.getString("url"), rs.getBoolean("authorized")));
            }
            return urls;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Read a new by url
     * 
     * @param url
     * @return New object or New object with url null and authorized null if not
     *         found
     * @throws Exception
     */
    public News read(String url) throws Exception {
        String sql = "SELECT * FROM authorized_news WHERE url = ?";

        try (Connection conn = connection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, url);
            ResultSet rs = stmt.executeQuery();

            News news = new News();

            if (rs.next()) {
                news.setUrl(rs.getString("url"));
                news.setAuthorized(rs.getBoolean("authorized"));
                return news;
            }

            return null;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Create a new
     * 
     * @param news
     * @return 1 if created, -1 if found, -2 if found and already exists, 0 if
     *         already exists
     * @throws Exception
     */
    @Transactional
    public int create(News news, Boolean found) throws Exception {
        String sql = "INSERT INTO authorized_news (url, authorized) VALUES (?, ?)";

        try (Connection conn = connection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            News aux = read(news.getUrl());
            if (aux != null) {
                if (found) {
                    return -2;
                }
                return 0;
            }

            if (found) {
                return -1;
            } else {
                stmt.setString(1, news.getUrl());
                stmt.setBoolean(2, news.getAuthorized());
                stmt.executeUpdate();

                return 1;
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Delete a new by url
     * 
     * @param url
     * @return 1 if deleted, 0 if not found
     * @throws Exception
     */
    @Transactional
    public int delete(String url) throws Exception {
        String sql = "DELETE FROM authorized_news WHERE url = ?";

        try (Connection conn = connection.getConnection();
                PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, url);
            return stmt.executeUpdate();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
