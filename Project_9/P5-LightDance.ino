#include <Arduino_JSON.h>

const int ledPin1 = 13; // LED connected to Arduino pin 13
const int ledPin2 = 12; // LED connected to Arduino pin 12
unsigned long previousMillis = 0;
const long interval = 500; // Interval for LED dance in milliseconds, increased to slow down the dance

void setup() {
  pinMode(ledPin1, OUTPUT); // Set ledPin1 as an output
  pinMode(ledPin2, OUTPUT); // Set ledPin2 as an output
  Serial.begin(9600);       // Setup Serial communication at 9600 baud rate
}

void loop() {
  if (Serial.available() > 0) {
    String jsonString = Serial.readStringUntil('\n');
    if (jsonString != '\n') {
      JSONVar serialInput = JSON.parse(jsonString);

      if (JSON.typeof(serialInput) == "undefined") {
        Serial.println("JSON parsing failed!");
      } else {
        if (serialInput.hasOwnProperty("toggleLED")) {
          digitalWrite(ledPin1, (bool)serialInput["toggleLED"]);
        }
        if (serialInput.hasOwnProperty("lightDance")) {
          if ((bool)serialInput["lightDance"]) {
             ledDance((bool)serialInput["lightDance"]); // Call ledDance with the received boolean value
          }
        }
      }
    }
  }
}

void ledDance(bool active) {
  static unsigned long previousMillis = 0;
  const long interval = 5; // Interval for LED dance in milliseconds
  static int ledBrightness1 = 0;
  static int ledBrightness2 = 255;
  static int fadeAmount = 5;

  if (active) {
    unsigned long currentMillis = millis();

    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;

      // Fade the LEDs
      analogWrite(ledPin1, ledBrightness1);
      analogWrite(ledPin2, ledBrightness2);

      ledBrightness1 = ledBrightness1 + fadeAmount;
      ledBrightness2 = ledBrightness2 - fadeAmount;

      // Reverse the direction of the fading at the ends of the fade
      if (ledBrightness1 <= 0 || ledBrightness1 >= 255) {
        fadeAmount = -fadeAmount;
      }
    }
  } else {
    // Turn off both LEDs
    analogWrite(ledPin1, 0);
    analogWrite(ledPin2, 0);
  }
}

