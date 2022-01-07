#include <Arduino_JSON.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define TIMEOUT 5000
#define PORTA_DEFAULT 80  
#define PERIODO_DEFAULT 1
#define LIMITE_MINIMO 50  
#define LIMITE_MAXIMO 80  

//login e senha do wi-fi
const char *ssid = "Sei la";         
const char *pass = "eujadisse";

//variaveis de comunicacao
String serverName = "http://192.168.15.46:8080/api/v1/systems";
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(PORTA_DEFAULT);

struct DadosDoSistema {
  String macAddr;
  String ip;
  int periodoMedicao; 
  int limiteMinimo;
  int limiteMaximo;
  float umidadeAtual;
};

DadosDoSistema dadosDoSistema;

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

  //Especifica qual funcao sera chamada qdo recebermos um request
  server.on("/atualizarDados", atualizarDados); 

  //Inicia servidor esp8266
  server.begin(); 
  Serial.println("Server listening");

  inicializaEstruturaDados();
}

void loop()
{
  server.handleClient(); //Handling of incoming requests
  // 1 sec delay
  delay(1000);
}

void inicializaEstruturaDados() {
  float h = lerSensor();
  
  dadosDoSistema = {
    WiFi.macAddress(),
    WiFi.localIP().toString(),
    PERIODO_DEFAULT,
    LIMITE_MINIMO,
    LIMITE_MAXIMO,
    h
  };
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
  dadosDoSistema.umidadeAtual = h;
  return h;
}

//Handler para o atualizarDados
void atualizarDados() { 
 
  //if (server.hasArg("plain")== false){ //Check if body received
  //      server.send(200, "text/plain", "Body not received");
  //      return;
  //}

  //String message = "Body received:\n";
  //       message += server.arg("plain");
  //       message += "\n";
  //Serial.println(message);

  lerSensor();
  String resposta = toJson();//"{\"umidade\":\"" + String(lerSensor(), 2) + "\"}";

  server.send(200, "text/plain", resposta);
  Serial.println(resposta);
}

String toJson() {
  String abreJson = "{";
  String mac = "\"macAddress\":\"" + dadosDoSistema.macAddr + "\"";
  String ip = "\"ip\":\"" + String(dadosDoSistema.ip) + "\"";
  String periodoMedicao = "\"periodoMedicao\":\"" + String(dadosDoSistema.periodoMedicao) + "\"";
  String limiteMinimo = "\"limiteMinimo\":\"" + String(dadosDoSistema.limiteMinimo) + "\"";
  String limiteMaximo = "\"limiteMaximo\":\"" + String(dadosDoSistema.limiteMaximo) + "\"";
  String umidade = "\"umidade\":\"" + String(dadosDoSistema.umidadeAtual, 2) + "\"";
  String fechaJson = "}";
  String v = ",";

  return abreJson + mac + v + ip + v + periodoMedicao + v + limiteMinimo + v + limiteMaximo + v + umidade + fechaJson; 
}
