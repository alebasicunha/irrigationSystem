uint8_t relePin = D5;       // declare pin on NodeMCU Dev Kit

void setup() {
pinMode(relePin, OUTPUT);   // Initialize the LED pin as an output
}

void loop() {
Serial.println("Ligando motor");
digitalWrite(relePin, HIGH); // Turn the LED on
delay(1000);                // Wait for a second
Serial.println("Desligando motor");
digitalWrite(relePin, LOW);// Turn the LED off
delay(1000);                // Wait for a second
}
