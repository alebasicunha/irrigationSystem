#include <Arduino.h>
#include <Arduino_JSON.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WiFi.h>
#include <WiFiClient.h>

#define TIMEOUT 5000
#define PORTA_DEFAULT 80  
#define PERIODO_DEFAULT 1
#define LIMITE_MINIMO 30  
#define LIMITE_MAXIMO 60  

unsigned long lastTime = 0;
//1h = 3600000ms
//10min = 600000ms
unsigned long timerDelay = 60000;
int httpResponseCode = 0;

//login e senha do wi-fi
const char *ssid = "Sei la";         
const char *pass = "eujadisse";

//variaveis de comunicacao
String serverClient = "http://192.168.15.46:8080/api/v1/systems";
WiFiClient client;
HTTPClient http;
ESP8266WebServer server(PORTA_DEFAULT);

// Variaveis do sistema
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

// Variaveis do estado da rega
uint8_t relePin = D5;      
enum statusRega {
  IDLE,
  REGANDO,
  ACIMA_LIMITE_MAXIMO,
  FIM
};

statusRega status = IDLE;
boolean comecarRegaManual = false;

void setup()
{
  Serial.begin(9600);
  delay(10);

  // Initialize the LED pin as an output
  pinMode(relePin, OUTPUT);
  
  conectarWiFi();

  //Especifica qual funcao sera chamada em cada request
  server.on("/atualizarDados", enviarDadosAtualizados);
  server.on("/editarDados", receberDadosAtualizados);
  server.on("/regarManual", regarManual); 

  //Inicia servidor esp8266
  server.begin(); 
  Serial.println("----- Servidor ouvindo ----- \n");

  inicializaEstruturaDados();
}

void loop()
{
  //Lida com os requests dos clientes
  server.handleClient(); 
  postOnBD();
  regar();
  delay(1000);
}

void conectarWiFi() {
  Serial.print("\n\nMAC: ");
  Serial.println(WiFi.macAddress());
  Serial.println("Connecting to ");
  
  Serial.println(ssid);
  WiFi.begin(ssid, pass);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n----- WiFi connected -----");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); //IP local do ESP8266 na rede wifi
}

void inicializaEstruturaDados() {
  Serial.println("Inicializando estrutura!");
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

//Lida com o atualizarDados
void enviarDadosAtualizados() { 
  lerSensor();
  String resposta = toJson();
  server.send(200, "text/plain", resposta);
  Serial.println(resposta);
}

//Lida com o regarManual
void regarManual() { 
  comecarRegaManual = true;  
  String msg = "";

  verificarNecessidadeDeRegar();

  switch (status)
  {
    case REGANDO:
      msg = "Sucesso.";
      break;
    
    case ACIMA_LIMITE_MAXIMO:
      msg = "Erro: acima do limite permitido.";
      status = IDLE;
      break;

    default: 
      msg = "Erro desconhecido.";
      break;
  }

  server.send(200, "text/plain", msg);
  Serial.println(msg);

  comecarRegaManual = false;
}

void receberDadosAtualizados() {
  // Checa se o corpo da mensagem veio na request
   if (server.hasArg("plain") == false) { 
      server.send(200, "text/plain", "Body not received");
      return;
  }

  JSONVar dadoJson = JSON.parse(server.arg("plain"));

  if (JSON.typeof(dadoJson) == "undefined") {

    Serial.println("Erro no formato do corpo da mensagem!");
    server.send(200, "text/plain", "Body not received.");
    return;

  } else {

    if (dadoJson.hasOwnProperty("nome") 
      && dadoJson.hasOwnProperty("periodoMedicao")
      && dadoJson.hasOwnProperty("limiteMinimo") 
      && dadoJson.hasOwnProperty("limiteMaximo")) {

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

/*
  Envia um HTTP POST para a aplicacao a cada periodo de tempo ou ao fim da rega
  contendo os dados de sistemas atuais.
  Se houver erro durante o envio, 
  reenvia enquanto o codigo de resposta nao for de SUCESSO
*/
void postOnBD() {
  if (status == REGANDO) {
    return;
  }

  if (((millis() - lastTime) > (dadosDoSistema.periodoMedicao * timerDelay)) 
        || (httpResponseCode < 0) 
        || (status == FIM)) {
    
    if (!(httpResponseCode < 0)) {
      verificarNecessidadeDeRegar();
      status = status == ACIMA_LIMITE_MAXIMO ? IDLE : status;
    }    

    // Checa conexão antes de tentar enviar.
    if(WiFi.status() == WL_CONNECTED) {     
      
      Serial.println("Enviando dados para aplicacao: ");
      String dadoAtual = toJson();
      imprimirDadosDoSistema();

      http.begin(client, serverClient);      
      http.addHeader("Content-Type", "application/json");
      httpResponseCode = http.POST(dadoAtual);

      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      Serial.println("\n");
      http.end();


    } else {
      Serial.println("WiFi Disconnected!!!");
    }

    lastTime = millis();
  }
}

void regar() {
  if(status == REGANDO) {
    Serial.println("\nLigando motor");
    digitalWrite(relePin, HIGH);
    delay(1000);                
    Serial.println("Desligando motor\n");
    digitalWrite(relePin, LOW);
    verificarNecessidadeDeRegar();
  }
}

void verificarNecessidadeDeRegar() {
  float umidade = lerSensor();
  if (umidade < dadosDoSistema.limiteMaximo) {
    if (umidade < dadosDoSistema.limiteMinimo || comecarRegaManual) {
      status = REGANDO;
    }
  } else {
    Serial.println("Acima do limite maximo!!!");

    status = status == REGANDO ? FIM : ACIMA_LIMITE_MAXIMO;
  }
}

float lerSensor() {
  //  Valor lido x Umidade 
  //   1024 --------  0%
  //    0   -------- 100%
  float h = 100 - (analogRead(A0)/10.24);
  if (isnan(h))
  {
    Serial.println("Nao foi possivel ler o sensor!");
    return -1;
  }
  
  Serial.print("Umidade atual: ");
  dadosDoSistema.umidadeAtual = h;
  Serial.print(dadosDoSistema.umidadeAtual);
  Serial.println("%");
  return h;
}

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
  Serial.println("----- Imprimir dadosDoSistema: -----");
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
  Serial.println("------------------------------------");
}
