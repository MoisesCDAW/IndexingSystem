package IndexingSystem.component.models;

public class News {
    private String url;
    private Boolean authorized;

    public News() {
    }

    public News(String url, Boolean authorized) {
        this.url = url;
        this.authorized = authorized;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public Boolean getAuthorized() {
        return authorized;
    }

    public void setAuthorized(Boolean authorized) {
        this.authorized = authorized;
    }

    @Override
    public String toString() {
        return "New{" +
                "url='" + url + '\'' +
                ", authorized=" + authorized +
                '}';
    }
}
