package IndexingSystem.component.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class NewsTest {

    // This test checks that the default constructor initializes the News object
    // with null values.
    @Test
    void testDefaultConstructor() {
        News news = new News();
        assertNull(news.getUrl());
        assertNull(news.getAuthorized());
    }

    // This test verifies that the parameterized constructor correctly initializes
    // the News object with given values.
    @Test
    void testParameterizedConstructor() {
        String expectedUrl = "http://example.com";
        Boolean expectedAuthorized = true;
        News news = new News(expectedUrl, expectedAuthorized);
        assertEquals(expectedUrl, news.getUrl());
        assertEquals(expectedAuthorized, news.getAuthorized());
    }

    // This test verifies that the getter and setter methods work as expected for
    // the News class.
    @Test
    void testGettersAndSetters() {
        News news = new News();
        String url = "http://example.com";
        Boolean authorized = false;

        news.setUrl(url);
        news.setAuthorized(authorized);

        assertEquals(url, news.getUrl());
        assertEquals(authorized, news.getAuthorized());
    }

    // This test verifies that the toString method produces the expected string
    // representation of the News object.
    @Test
    void testToString() {
        String expectedUrl = "http://example.com";
        Boolean expectedAuthorized = true;
        News news = new News(expectedUrl, expectedAuthorized);

        String expectedString = "New{url='http://example.com', authorized=true}";
        assertEquals(expectedString, news.toString());
    }
}
