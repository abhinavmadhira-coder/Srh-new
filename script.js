import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONArray;
import org.json.JSONObject;

public class SRHTracker {

    // 🔑 Paste your CricData API key here
    private static final String API_KEY = "53138c46-05a4-4969-b79a-465cfdcea7a1";

    // Base URLs (adjust if CricData docs use different endpoints)
    private static final String UPCOMING_URL = "https://api.cricdata.com/matches/upcoming?apikey=" + API_KEY;
    private static final String LIVE_URL = "https://api.cricdata.com/matches/live?apikey=" + API_KEY;

    public static void main(String[] args) {
        System.out.println("🔥 Sunrisers Hyderabad Tracker 🔥");
        System.out.println("----------------------------------");

        // Show upcoming fixtures
        System.out.println("\nUpcoming Fixtures:");
        fetchMatches(UPCOMING_URL);

        // Show live matches
        System.out.println("\nLive Match:");
        fetchMatches(LIVE_URL);
    }

    private static void fetchMatches(String endpoint) {
        try {
            URL url = new URL(endpoint);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");

            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String inputLine;
            StringBuilder response = new StringBuilder();

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

            JSONObject json = new JSONObject(response.toString());

            // Assuming CricData returns matches in an array called "matches"
            JSONArray matches = json.getJSONArray("matches");

            for (int i = 0; i < matches.length(); i++) {
                JSONObject match = matches.getJSONObject(i);

                String team1 = match.getString("team1");
                String team2 = match.getString("team2");

                // Filter only SRH matches
                if (team1.contains("Sunrisers Hyderabad") || team2.contains("Sunrisers Hyderabad")) {
                    String date = match.optString("date", "N/A");
                    String venue = match.optString("venue", "N/A");
                    String status = match.optString("status", "N/A");
                    String score = match.optString("score", "Not started");

                    System.out.println(team1 + " vs " + team2);
                    System.out.println("Date: " + date);
                    System.out.println("Venue: " + venue);
                    System.out.println("Status: " + status);
                    System.out.println("Score: " + score);
                    System.out.println("----------------------------------");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
