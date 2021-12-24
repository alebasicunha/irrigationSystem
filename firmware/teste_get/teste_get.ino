#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define TIMEOUT  5000  

//login e senha do wi-fi
const char *ssid = "Sei la";         // replace with your wifi ssid and wpa2 key
const char *pass = "eujadisse";

String serverName = "http://192.168.15.46:8080/api/v1/systems";
WiFiClient client;
HTTPClient http;

void setup()
{
  Serial.begin(9600);
  delay(10);

  //conectar ao wi-fi
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}
void loop()
{
  //  Valor lido x Umidade 
  //   1024 --------  0%
  //    0   -------- 100%
  float h = 100 - (analogRead(A0)/10.24);
  if (isnan(h))
  {
    Serial.println("Failed to read from sensor!");
    return;
  }
  
  Serial.print("Humidity Level: ");
  Serial.println(h);
  httpGetByIdRequest();
     
  // thingspeak needs minimum 15 sec delay between updates.
  delay(15000);
}

void httpGetByIdRequest() {

  String serverPath = serverName + "/1";
  
  //GET BY ID VIA HTTP
  // Your Domain name with URL path or IP address with path
  http.begin(client, serverPath.c_str());

  // Send HTTP GET request 
  int httpResponseCode = http.GET();

  //CHECANDO RESPOSTA    
  if (httpResponseCode>0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  
  // Free resources
  http.end();  
 
  delay(500);
  client.stop();
  Serial.println("Waiting...\n");
}
