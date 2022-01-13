#include <ESP8266WiFi.h>
//#include "ThingSpeak.h"

#define TIMEOUT  5000  

String apiKey = "5CFX8T4ODK2TV4LK"; // Enter your Write API key from ThingSpeak
const char *ssid = "Sei la";         // replace with your wifi ssid and wpa2 key
const char *pass = "eujadisse";
const char* server = "api.thingspeak.com";
WiFiClient client;

void setup()
{
  Serial.begin(9600);
  delay(10);
  Serial.println("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
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
 
  if (client.connect(server, 80)) // "184.106.153.149" or api.thingspeak.com
  {
    Serial.print("Humidity Level: ");
    Serial.println(h);

    //MONTANDO MSG A SER ENVIADA
    String postStr = "api_key=" + apiKey + "&field1=" + String(h);

    //POST VIA HTTP
    client.println("POST /update HTTP/1.1");
    client.println("Host: api.thingspeak.com");
    client.println("Connection: close");
    client.println("Content-Type: application/x-www-form-urlencoded");
    client.println("Content-Length: " + String(postStr.length()));
    client.println();
    client.println(postStr);

    //CHECANDO RESPOSTA
    String answer = getResponse();
    if(answer.indexOf("Status: 200 OK") != -1) { 
      Serial.println("Data Send to Thingspeak.");
    } else {
      Serial.println("POST FAILED.");
    }    
  }
  delay(500);
  client.stop();
  Serial.println("Waiting...\n");
     
  // thingspeak needs minimum 15 sec delay between updates.
  delay(15000);
}

String getResponse(){
  String response;
  long startTime = millis();

  delay( 200 );
  while ( client.available() < 1 && (( millis() - startTime ) < TIMEOUT ) ){
        delay( 5 );
  }
  
  if( client.available() > 0 ){ // Get response from server.
     char charIn;
     do {
         charIn = client.read(); // Read a char from the buffer.
         response += charIn;     // Append the char to the string response.
        } while ( client.available() > 0 );
    }
  client.stop();
        
  return response;
}
