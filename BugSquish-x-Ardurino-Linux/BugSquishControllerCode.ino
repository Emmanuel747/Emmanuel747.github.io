#include <Arduino_JSON.h>

const int potentiometerPin = A0; // Analog pin connected to the potentiometer
const int buttonPin = 2;          // Digital pin connected to the button

void setup() {
  Serial.begin(9600); // Setup Serial communication at 9600 baud rate
  pinMode(buttonPin, INPUT_PULLUP); // Set buttonPin as INPUT with internal pull-up resistor
}

void loop() {
  int potentiometerValue = analogRead(potentiometerPin); // Read the potentiometer value
  int buttonState = !digitalRead(buttonPin); // Read the button state (inverted due to pull-up resistor)

  JSONVar sensorData; // Create JSON object to store sensor data
  sensorData["x"] = potentiometerValue;
  sensorData["y"] = potentiometerValue;
  sensorData["button"] = buttonState;

  String jsonString = JSON.stringify(sensorData); // Convert JSON object to a string
  Serial.println(jsonString); // Send the JSON string over the serial connection

  delay(20); // Add a small delay to prevent overwhelming the serial connection
}
