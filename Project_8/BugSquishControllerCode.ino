#include <Arduino_JSON.h>

const int xValuePIN = A1;  // Analog pin connected to the X axis of the Joystick
const int yValuePIN = A3;  // Analog pin connected to the Y axis of the Joystick
const int joyBtnPin = 4;   // Digital pin connected to the button
const int buzzer = 8;      // Buzzer connected to Arduino pin 9
const int ledPin1 = 13;    // LED connected to Arduino pin 13
const int ledPin2 = 12;    // LED connected to Arduino pin 12

int playerScore = 0;       // Declare player score variable
int previousScore = 0; // Track previous score

void setup() {
  Serial.begin(9600);      // Setup Serial communication at 9600 baud rate
  pinMode(joyBtnPin, INPUT_PULLUP); // Set joyBtnPin as INPUT with internal pull-up resistor
  pinMode(buzzer, OUTPUT); // Set buzzer - pin 9 as an output
  pinMode(ledPin1, OUTPUT); // Set ledPin1 - pin 13 as an output
  pinMode(ledPin2, OUTPUT); // Set ledPin2 - pin 12 as an output
}

void loop() {
  // Read the X and Y values from the Joystick
  int JoyStickX = analogRead(xValuePIN);
  int JoyStickY = analogRead(yValuePIN);
  
  // Read the button state (inverted due to pull-up resistor)
  int buttonState = !digitalRead(joyBtnPin); 

  // Reading score from Serial input
  if (Serial.available() > 0) {
    String jsonString = Serial.readStringUntil("\n");
    if (jsonString != '\n') {
      JSONVar serialInput = JSON.parse(jsonString);

      if (JSON.typeof(serialInput) == "undefined") {
        Serial.println("JSON parsing failed!");
      } else {
        playerScore = (int) serialInput["score"]; // Set player score from the serial input
      }
    }
  }

  // Create JSON object to store sensor data
  JSONVar sensorData; 
  sensorData["x"] = JoyStickX;  // Add the X value to the JSON object
  sensorData["y"] = JoyStickY;  // Add the Y value to the JSON object
  sensorData["button"] = buttonState;  // Add the button state to the JSON object

  // Convert JSON object to a string
  String jsonString = JSON.stringify(sensorData); 
  
  // Send the JSON string over the serial connection
  Serial.println(jsonString); 

  // Call the buzzer function if the player score increases
  if (playerScore > previousScore) {
    ringBuzzer(); 
    // flashLights(); // Flash the two lights on pins 13 and 12
    previousScore = playerScore;
    
  }

  // delay(20); // Add a small delay to prevent overwhelming the serial connection
}

// Function to control the buzzer
void ringBuzzer () {
  digitalWrite(buzzer, HIGH);  // Turn on the buzzer
  delay(40);  // Delay for 0.5 seconds
  digitalWrite(buzzer, LOW);  // Turn off the buzzer
}

// Function to flash the two lights briefly
void flashLights() {
  digitalWrite(ledPin1, HIGH); // Turn on LED on pin 13
  digitalWrite(ledPin2, HIGH); // Turn on LED on pin 12
  delay(50); // Delay for 0.1 seconds
  
  // Turn off the LED on pin 12 after 100 milliseconds
  digitalWrite(12, LOW);
  delay(100);

  // Turn on the LED on pin 13 for 100 milliseconds
  digitalWrite(13, HIGH);
  delay(100);

  // Turn off the LED on pin 13 after 100 milliseconds
  digitalWrite(13, LOW);
  delay(100);
}