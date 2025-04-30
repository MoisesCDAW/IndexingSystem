package IndexingSystem.services;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Lazy
public class NewsCheck {

    private static final Pattern VALID_WORD_PATTERN = Pattern.compile("^[\\p{L}\\p{N}\']+$");

    public ArrayList<Object> searchWordsInUrl(String url, ArrayList<String> words) throws Exception {
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL cannot be null or empty");
        }
        if (words == null) {
            throw new IllegalArgumentException("Word list cannot be null");
        }
        if (words.isEmpty()) {
            throw new IllegalArgumentException("The list of words is empty");
        }

        try {
            Document document = Jsoup.connect(url).get();
            String pageText = document.body().text().toLowerCase();

            for (String word : words) {
                if (word == null) {
                    throw new IllegalArgumentException("Word cannot be null");
                }

                word = word.trim();

                if (word.isEmpty()) {
                    throw new IllegalArgumentException("Word cannot be empty");
                }

                word = word.toLowerCase();

                if (!isValidWord(word)) {
                    throw new IllegalArgumentException("Word not valid: " + word);
                }

                if (pageText.contains(word)) {
                    return new ArrayList<>(List.of(true, word));
                }
            }

            return new ArrayList<>(List.of(false, ""));
        } catch (IOException e) {
            throw new RuntimeException("Error connecting to URL: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error processing content: " + e.getMessage(), e);
        }
    }

    private boolean isValidWord(String word) {
        return VALID_WORD_PATTERN.matcher(word).matches();
    }
}