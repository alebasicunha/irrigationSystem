#include <Arduino.h>

void setup() {
    Serial.begin(9600);
}

void loop() {
    //Menos agua = maior resistencia
    //  Valor lido x Umidade 
    //   1024 --------  0%
    //    0   -------- 100%
    float leitura = analogRead(A0);
    float h = 100 - (leitura/10.24);    

    Serial.print("Leitura: ");
    Serial.println(leitura);
    Serial.print("Umidade atual: ");
    Serial.println(h);
    delay(500);
}
