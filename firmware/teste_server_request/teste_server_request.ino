#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define TIMEOUT  5000  

//login e senha do wi-fi
const char *ssid = "Sei la";         // replace with your wifi ssid and wpa2 key
const char *pass = "eujadisse";

String serverName = "http://192.168.15.46:8080/api/v1/systems";
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(80);

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
  Serial.println(WiFi.localIP()); //IP local do ESP8266 na rede wifi

  server.on("/body", handleBody); //Especifica qual funcao sera chamada qdo recebermos um request
 
  server.begin(); //Start the server
  Serial.println("Server listening");
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

  server.handleClient(); //Handling of incoming requests
  // 1 sec delay
  delay(1000);
}

void handleBody() { //Handler for the body path
 
  if (server.hasArg("plain")== false){ //Check if body received

        server.send(200, "text/plain", "Body not received");
        return;

  }

  String message = "Body received:\n";
         message += server.arg("plain");
         message += "\n";

  server.send(200, "text/plain", message);
  Serial.println(message);
}
