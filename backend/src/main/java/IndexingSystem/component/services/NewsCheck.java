package IndexingSystem.component.services;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
@Lazy
public class NewsCheck {

    public ArrayList<Object> searchWordsInUrl(String url, ArrayList<String> words) throws Exception {
        try {
            Document document = Jsoup.connect(url).get();
            String pageText = document.body().text();

            if (words.isEmpty()) {
                throw new IllegalArgumentException("The list of words is empty.");
            }

            for (String word : words) {
                word = word.toLowerCase().trim();
                if (word != null) {
                    if (pageText.contains(word)) {
                        return new ArrayList<>(List.of(true, word));
                    }
                }
            }

            return new ArrayList<>(List.of(false, ""));
        } catch (Exception e) {
            throw new RuntimeException("Error getting page content: " + e);
        }
    }
}
