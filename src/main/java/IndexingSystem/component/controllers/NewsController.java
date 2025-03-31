package IndexingSystem.component.controllers;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import IndexingSystem.component.models.News;
import IndexingSystem.component.repository.H2Repository;
import IndexingSystem.component.services.NewsCheck;
import jakarta.annotation.PostConstruct;

@RestController
@RequestMapping("/content")
public class NewsController {

    @Autowired
    private H2Repository h2Repository;

    @Autowired
    @Lazy
    private NewsCheck newsCheck;

    @PostConstruct
    public void init() {

        try {
            h2Repository.createTable();
        } catch (Exception e) {
            System.out.println("Error creating table: " + e);
        }
    }

    /**
     * Get all news
     * 
     * @return List of news, 204 if the list is empty or 500 if error
     */
    @GetMapping
    public ResponseEntity<?> GetAllNews() {
        try {
            List<News> news = h2Repository.readAll();

            if (news.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }

            return ResponseEntity.ok(Map.of("All news", news));
        } catch (Exception e) {
            System.out.println("Error getting all news: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Error", "Error getting all news: " + e));
        }
    }

    /**
     * Get a new by url
     * 
     * @param url
     * @return news or 204 if not found
     */
    @GetMapping("/url")
    public ResponseEntity<?> getNews(@RequestBody Map<String, String> entity) {
        News aux;
        try {
            aux = h2Repository.read(entity.get("url"));
            if (aux != null) {
                return ResponseEntity.ok(Map.of("URL", "'" + entity.get("url") + "'"));
            }

            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            System.out.println("Error getting new: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Error", "Error getting new: " + e));
        }
    }

    /**
     * Check if a word is in a URL. If found, return a message, otherwise, add the
     * news to the database.
     *
     * @param entity Request body containing the URL and words to check.
     * @return 201 if created, 409 if already exists, 500 if an error occurs, 200 if
     *         the word is in the URL.
     */
    @PostMapping("/check")
    public ResponseEntity<Map<String, String>> postNews(@RequestBody Map<String, ?> entity) {
        boolean found;
        News news = new News();

        try {
            found = newsCheck.searchWordsInUrl((String) entity.get("url"), (ArrayList<String>) entity.get("words"));
        } catch (Exception e) {
            System.out.println("Error checking word in URL: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Error", "Error checking word in URL: " + e.getMessage()));
        }

        if (found) {
            return ResponseEntity.ok(Map.of("state", "rejected"));
        } else {
            news.setUrl(entity.get("url").toString());
            news.setAuthorized(true);

            try {
                int aux = h2Repository.create(news);

                if (aux == 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body(Map.of("Error", "The news with URL '" + news.getUrl() + "' already exists"));
                }

                URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{url}")
                        .buildAndExpand(news.getUrl())
                        .toUri();

                return ResponseEntity.created(location).body(Map.of("state", "accepted"));

            } catch (Exception e) {
                System.out.println("Error creating news: " + e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("Error", "Error creating news: " + e.getMessage()));
            }
        }
    }

    /**
     * Delete a new by id
     * 
     * @param url
     * @return 204 if deleted, 204 if not found
     */
    @DeleteMapping
    public ResponseEntity<?> deleteNews(@RequestBody Map<String, String> entity) {
        try {
            System.out.println(entity.get("url"));
            int aux = h2Repository.delete(entity.get("url"));

            if (aux == 0) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
            }

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error deleting new: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("Error", "Error deleting new: " + e));
        }
    }

}
