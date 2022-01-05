#include <Arduino_JSON.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define TIMEOUT  5000  
#define PERIODO_DEFAULT 1;  
#define LIMITE_MINIMO 50;  
#define LIMITE_MAXIMO 80;  

int macAddr;
int periodoMedicao = PERIODO_DEFAULT; 
int limiteMinimo = LIMITE_MINIMO;
int limiteMaximo = LIMITE_MAXIMO;
float umidadeAtual;

struct dadosDoSistema {
  String macAddr;
  int periodoMedicao = PERIODO_DEFAULT; 
  int limiteMinimo = LIMITE_MINIMO;
  int limiteMaximo = LIMITE_MAXIMO;
  float umidadeAtual;
};

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
  Serial.print("MAC: ");
  Serial.println(WiFi.macAddress());
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

  server.on("/atualizarDados", atualizarDados); //Especifica qual funcao sera chamada qdo recebermos um request
 
  server.begin(); //Start the server
  Serial.println("Server listening");
}

void loop()
{
  server.handleClient(); //Handling of incoming requests
  // 1 sec delay
  delay(1000);
}

float lerSensor() {
  //  Valor lido x Umidade 
  //   1024 --------  0%
  //    0   -------- 100%
  float h = 100 - (analogRead(A0)/10.24);
  if (isnan(h))
  {
    Serial.println("Failed to read from sensor!");
    return -1;
  }
  
  Serial.print("Humidity Level: ");
  Serial.println(h);
  return h;
}

void atualizarDados() { //Handler para o atualizarDados
 
  //if (server.hasArg("plain")== false){ //Check if body received
  //      server.send(200, "text/plain", "Body not received");
  //      return;
  //}

  //String message = "Body received:\n";
  //       message += server.arg("plain");
  //       message += "\n";
  //Serial.println(message);

  String resposta = "{\"umidade\":\"" + String(lerSensor(), 2) + "\"}";

  server.send(200, "text/plain", resposta);
  Serial.println(resposta);
}
