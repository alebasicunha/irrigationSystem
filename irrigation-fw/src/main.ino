#include <Arduino.h>
#include <Arduino_JSON.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>

#define TIMEOUT 5000
#define PORTA_DEFAULT 80  
#define PERIODO_DEFAULT 1
#define LIMITE_MINIMO 50  
#define LIMITE_MAXIMO 80  

unsigned long lastTime = 0;
//1h = 3600000ms
//10min = 600000
unsigned long timerDelay = 600000;
int httpResponseCode = 0;

//login e senha do wi-fi
const char *ssid = "Sei la";         
const char *pass = "eujadisse";

//variaveis de comunicacao
String serverClient = "http://192.168.15.46:8080/api/v1/systems";
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(PORTA_DEFAULT);

struct DadosDoSistema {
  String macAddr;
  String nome;
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
  server.on("/atualizarDados", enviarDadosAtualizados);
  server.on("/editarDados", receberDadosAtualizados);
  server.on("/regarManual", regarManual); 

  //Inicia servidor esp8266
  server.begin(); 
  Serial.println("Server listening");

  inicializaEstruturaDados();
}

void loop()
{
  server.handleClient(); //Handling of incoming requests
  postOnClient();
  // 1 sec delay
  delay(1000);
}

void inicializaEstruturaDados() {
  float h = lerSensor();
  
  dadosDoSistema = {
    WiFi.macAddress(),
    WiFi.macAddress(), //nome inicial
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
void enviarDadosAtualizados() { 
  lerSensor();
  String resposta = toJson();
  server.send(200, "text/plain", resposta);
  Serial.println(resposta);
}

//Handler para o regarManual
void regarManual() { 
  String resposta = "Regar manualmente!!!!";
  server.send(200, "text/plain", resposta);
  Serial.println(resposta);
}

void receberDadosAtualizados() {
   if (server.hasArg("plain")== false){ //Check if body received
        server.send(200, "text/plain", "Body not received");
        return;
  }

  JSONVar dadoJson = JSON.parse(server.arg("plain"));

  // JSON.typeof(jsonVar) can be used to get the type of the var
  if (JSON.typeof(dadoJson) == "undefined") {
    Serial.println("Parsing input failed!");
    server.send(200, "text/plain", "Body not received.");
    return;
  } else {
    if (dadoJson.hasOwnProperty("nome") 
      && dadoJson.hasOwnProperty("periodoMedicao")
      && dadoJson.hasOwnProperty("limiteMinimo") 
      && dadoJson.hasOwnProperty("limiteMaximo")) {

      Serial.print("JSON object = ");
      Serial.println(dadoJson);

      String periodo = (const char*) dadoJson["periodoMedicao"];
      String limiteMin = (const char*) dadoJson["limiteMinimo"];
      String limiteMax = (const char*) dadoJson["limiteMaximo"]; 
           
      dadosDoSistema = {
        WiFi.macAddress(),
        (const char*) dadoJson["nome"],
        WiFi.localIP().toString(),
        periodo.toInt(),
        limiteMin.toInt(),
        limiteMax.toInt(),
        dadosDoSistema.umidadeAtual
      };
  
      imprimirDadosDoSistema();
  
      String message = "Body received:\n";
           message += server.arg("plain");
           message += "\n";
      server.send(200, "text/plain", message);
    } else {
      Serial.println("Parsing input failed!");
      server.send(200, "text/plain", "Body not received.");
    }
  } 
}

void postOnClient(){  
   //Send an HTTP POST request every 10 minutes
  if (((millis() - lastTime) > (dadosDoSistema.periodoMedicao * timerDelay)) || (httpResponseCode < 0)) {
    //Check WiFi connection status
    if(WiFi.status()== WL_CONNECTED){

      lerSensor();
      String dadoAtual = toJson();
      Serial.print("Enviando para o site: ");
      Serial.println(dadoAtual);

      http.begin(client, serverClient);      
      http.addHeader("Content-Type", "application/json");
      httpResponseCode = http.POST(dadoAtual);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      
      http.end();
    }
    else {
      Serial.println("WiFi Disconnected");
    }
    lastTime = millis();
  }
}

//adicionar o nome
String toJson() {
  String abreJson = "{";
  String mac = "\"macAddress\":\"" + dadosDoSistema.macAddr + "\"";
  String nome = "\"nome\":\"" + dadosDoSistema.nome + "\"";
  String ip = "\"ip\":\"" + String(dadosDoSistema.ip) + "\"";
  String periodoMedicao = "\"periodoMedicao\":\"" + String(dadosDoSistema.periodoMedicao) + "\"";
  String limiteMinimo = "\"limiteMinimo\":\"" + String(dadosDoSistema.limiteMinimo) + "\"";
  String limiteMaximo = "\"limiteMaximo\":\"" + String(dadosDoSistema.limiteMaximo) + "\"";
  String umidade = "\"umidade\":\"" + String(dadosDoSistema.umidadeAtual, 2) + "\"";
  String fechaJson = "}";
  String v = ",";

  return abreJson + mac + v + nome + v + ip + v + periodoMedicao + v + limiteMinimo + v + limiteMaximo + v + umidade + fechaJson; 
}

void imprimirDadosDoSistema() {
  Serial.println("Imprimir dadosDoSistema: ");
  Serial.print("macAddress: ");
  Serial.println(dadosDoSistema.macAddr);
  Serial.print("nome: ");
  Serial.println(dadosDoSistema.nome);
  Serial.print("IP: ");
  Serial.println(dadosDoSistema.ip);
  Serial.print("Periodo: ");
  Serial.println(String(dadosDoSistema.periodoMedicao));
  Serial.print("Limite minimo: ");
  Serial.println(String(dadosDoSistema.limiteMinimo));
  Serial.print("Limite maximo: ");
  Serial.println(String(dadosDoSistema.limiteMaximo));
  Serial.print("Umidade: ");
  Serial.println(String(dadosDoSistema.umidadeAtual, 2));
}
