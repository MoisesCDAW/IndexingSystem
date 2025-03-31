package IndexingSystem.component.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class NewsTest {

    @Test
    void testDefaultConstructor() {
        // This test checks that the default constructor initializes the News object
        // with null values.
        News news = new News();
        assertNull(news.getUrl());
        assertNull(news.getAuthorized());
    }

    @Test
    void testParameterizedConstructor() {
        // This test verifies that the parameterized constructor correctly initializes
        // the News object with given values.
        String expectedUrl = "http://example.com";
        Boolean expectedAuthorized = true;
        News news = new News(expectedUrl, expectedAuthorized);
        assertEquals(expectedUrl, news.getUrl());
        assertEquals(expectedAuthorized, news.getAuthorized());
    }

    @Test
    void testGettersAndSetters() {
        // This test verifies that the getter and setter methods work as expected for
        // the News class.
        News news = new News();
        String url = "http://example.com";
        Boolean authorized = false;

        news.setUrl(url);
        news.setAuthorized(authorized);

        assertEquals(url, news.getUrl());
        assertEquals(authorized, news.getAuthorized());
    }

    @Test
    void testToString() {
        // This test verifies that the toString method produces the expected string
        // representation of the News object.
        String expectedUrl = "http://example.com";
        Boolean expectedAuthorized = true;
        News news = new News(expectedUrl, expectedAuthorized);

        String expectedString = "New{url='http://example.com', authorized=true}";
        assertEquals(expectedString, news.toString());
    }
}
