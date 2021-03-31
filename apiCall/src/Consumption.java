import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.json.JSONArray;
import org.json.JSONObject;


class Consumption {
    public static void main(String[] args) {
    	String[] stateCodes = {"AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", 
    	        "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC",
    	        "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"};
    	
		//COW: coal,GEO: geothermal, HYC: conventional hydroelectric, NG: natural gas, NUC: nuclear, PEL: petroleum liquid, SUN: solar, WND: wind
    	String[] fuelCodes = {"COW", "NG", "PEL"};
    	
    	String fuelName = "";
    	
    	for(String fuelCode : fuelCodes) {
    		String csv = "";
    		fuelName = fuelCode + "_con";
	    	for(String stateCode : stateCodes) {
	    		csv += apiCall(stateCode, fuelName, fuelCode);
	    	}
	    	if(csv != "") {
	        	csvWriter(csv, fuelName);
	        }
    	}
    }
    
    public static String apiCall(String stateCode, String fuelName, String fuelCode) {
        String csv = "";
        
        try {
            String urlString = "http://api.eia.gov/series/?api_key=382f831445c6c53a5b349373e9804570&series_id=ELEC.CONS_TOT." + fuelCode + "-" + stateCode + "-98.A";
            URL url = new URL(urlString);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.connect();

            //Getting the response stateCode
            int responsecode = conn.getResponseCode();

            if(responsecode != 200) {
                throw new RuntimeException("HttpResponseCode: " + responsecode);
            }
            else {
                String inline = "";
                Scanner scanner = new Scanner(url.openStream());
            
                //Write all the JSON data into a string using a scanner
                while (scanner.hasNext()) {
                    inline += scanner.nextLine();
                }
                
                //Close the scanner
                scanner.close();
                conn.disconnect();

                //JSON string and convert into JSONObject bc reasons
                JSONObject jo = new JSONObject(inline);
                //Check if the series actually exists, otherwise that state will be marked 0 for "no production"
                if(jo.has("series")) {
                	JSONArray ja = jo.getJSONArray("series");
                	String jaStr = replaceFirstandLast(ja.toString(), "", "");
                	jo = new JSONObject(jaStr);
                	ja = jo.getJSONArray("data");
                	ja = ja.getJSONArray(0);
                	csv += stateCode + "," + ja.get(1) + "\n";
                    System.out.println(stateCode + ": "  + ja.get(1));
                } else {
                	csv += stateCode + "," + "0" + "\n";
                }
            }
        } catch (Exception e) {
            System.out.println(e);
        }
        
        return csv;
    }
    
    public static String replaceFirstandLast(String str, String front, String end) {
    	str = str.substring(1, str.length() - 1);
    	str = front + str + end;
    	return str;
    }
    
    public static void csvWriter(String csvStr, String fuelName) {
    	try (PrintWriter writer = new PrintWriter(new File(fuelName + ".csv"))) {
    		writer.write(csvStr);
    		System.out.println("File Successfully Written!");
    	} catch (FileNotFoundException e) {
    		System.out.println(e.getMessage());
    	}
    }
}