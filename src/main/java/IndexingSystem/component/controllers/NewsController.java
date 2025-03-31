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
     * @return List of news or 500 if error
     */
    @GetMapping
    public ResponseEntity<?> GetAllNews() {
        try {
            List<News> news = h2Repository.readAll();
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            System.out.println("Error getting all news: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting all news: " + e);
        }
    }

    /**
     * Get a new by url
     * 
     * @param url
     * @return new or 404 if not found
     */
    @GetMapping("/new")
    public ResponseEntity<?> getNews(@RequestBody Map<String, String> entity) {
        News aux;
        try {
            aux = h2Repository.read(entity.get("url"));
            if (aux != null) {
                return ResponseEntity.ok("'" + entity.get("url") + "'");
            }

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("The new with url '" + entity + "' was not found");
        } catch (Exception e) {
            System.out.println("Error getting new: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error getting new: " + e);
        }
    }

    /**
     * Check if a word is in a url, if it is, return a message, if not, add the new
     * in the database
     * 
     * @param entity
     * @return 201 if created, 409 if already exists, 500 if error, 200 if the word
     *         is in the url
     */
    @PostMapping("/check")
    public ResponseEntity<?> postNews(@RequestBody Map<String, ?> entity) {
        Boolean found = true;
        News news = new News();

        try {
            found = newsCheck.searchWordsInUrl((String) entity.get("url"), (ArrayList<String>) entity.get("words"));
        } catch (Exception e) {
            System.out.println("Error checking word in url: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error checking word in url: " + e);
        }

        if (found) {
            return ResponseEntity
                    .ok("The list is empty or there is one or more words in the url '" + entity.get("url") + "'");
        } else {
            news.setUrl((String) entity.get("url").toString());
            news.setAuthorized(true);

            try {
                int aux = h2Repository.create(news);

                if (aux == 0) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("The new with url '" + news.getUrl() + "' already exists");
                }

                URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{url}")
                        .buildAndExpand(news.getUrl()).toUri();

                return ResponseEntity.created(location).body(news);

            } catch (Exception e) {
                System.out.println("Error creating new: " + e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating new: " + e);
            }
        }
    }

    /**
     * Delete a new by id
     * 
     * @param url
     * @return 204 if deleted, 404 if not found
     */
    @DeleteMapping
    public ResponseEntity<?> deleteNews(@RequestBody Map<String, String> entity) {
        try {
            System.out.println(entity.get("url"));
            int aux = h2Repository.delete(entity.get("url"));

            if (aux == 0) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("The new with url '" + entity + "' was not found");
            }

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            System.out.println("Error deleting new: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting new: " + e);
        }
    }

}
