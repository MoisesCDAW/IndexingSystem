package IndexingSystem.component.services;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.util.ArrayList;

@Service
@Lazy
public class NewsCheck {

    public Boolean searchWordsInUrl(String url, ArrayList<String> words) throws IOException {
        try {
            Document document = Jsoup.connect(url).get();
            String pageText = document.body().text().toLowerCase();

            if (words.isEmpty()) {
                return true;
            }

            for (String word : words) {
                if (word != null) {
                    if (pageText.contains(word.toLowerCase())) {
                        return true;
                    }
                }
            }

            return false;
        } catch (IOException e) {
            throw new RuntimeException("Error getting page content: " + e);
        }
    }
}
