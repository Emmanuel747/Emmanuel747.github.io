#include <Arduino_JSON.h>
#include <LiquidCrystal.h>

// initialize the library by associating any needed LCD interface pin
// with the arduino pin number it is connected to
const int rs = 12, en = 11, d4 = 5, d5 = 4, d6 = 3, d7 = 2;
LiquidCrystal lcd(rs, en, d4, d5, d6, d7);

const int xValuePIN = A1;  // Analog pin connected to the X axis of the Joystick
const int yValuePIN = A3;  // Analog pin connected to the Y axis of the Joystick
const int joyBtnPin = 7;   // Digital pin connected to the button
const int buzzer = 8;      // Buzzer connected to Arduino pin 9
const int greenLED = 13;    // LED connected to Arduino pin 13
const int redLED = 10;    // LED connected to Arduino pin 12

int playerScore = 0;       // Declare player score variable
int previousScore = 0; // Track previous score

bool playerMissed = false; // Player needs to trigger this

void setup() {
  Serial.begin(9600);      // Setup Serial communication at 9600 baud rate
  pinMode(joyBtnPin, INPUT_PULLUP); // Set joyBtnPin as INPUT with internal pull-up resistor
  pinMode(buzzer, OUTPUT); // Set buzzer - pin 9 as an output
  pinMode(greenLED, OUTPUT); // Set greenLED - pin 13 as an output
  pinMode(redLED, OUTPUT); // Set redLED - pin 12 as an output

  // set up the LCD's number of columns and rows:
  lcd.begin(16, 2);
  // Print a message to the LCD.
  lcd.print(" Current Score");
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
        playerScore = (int) serialInput["scoreVal"]; // Set player score from the serial input
        playerMissed = (bool) serialInput["playerMissed"]; //checks if player missed
      }
    }
  }

  // Create JSON object to store sensor data
  JSONVar sensorData; 
  sensorData["x"] = JoyStickX;  // Add the X value to the JSON object
  sensorData["y"] = JoyStickY;  // Add the Y value to the JSON object
  sensorData["button"] = buttonState;  // Add the button state to the JSON object
  sensorData["playerMissed"] = playerMissed; // Add the bool val to JSON object

  // Convert JSON object to a string
  String jsonString = JSON.stringify(sensorData); 
  
  // Send the JSON string over the serial connection
  Serial.println(jsonString); 

  // play buzzer for 2 sec if player misses
  if (playerMissed) {
    for (int i = 0; i>3; i++) {
      delay(400);
      digitalWrite(redLED, HIGH); // Turn on LED on pin 12
      digitalWrite(buzzer, HIGH);  // Turn on the buzzer
      delay(400);  // Delay for 0.4 seconds
      digitalWrite(buzzer, LOW);  // Turn off the buzzer   
      digitalWrite(redLED, LOW); // Turn on LED on pin 12 
    }
    digitalWrite(buzzer, HIGH);  // Turn on the buzzer
      delay(1000);  // Delay for 1.6 seconds
    digitalWrite(buzzer, LOW);  // Turn off the buzzer
    playerMissed = false;
  }

  // Call the buzzer function if the player score increases
  if (playerScore > previousScore) {
    ringBuzzer(); 
    flashLights(); // Flash the two lights on pins 13 and 12
    previousScore = playerScore;
    
  }

  // delay(20); // Add a small delay to prevent overwhelming the serial connection

  // LCD CODE BELOW
  // set the cursor to column 0, line 1
  // (note: line 1 is the second row, since counting begins with 0):
  lcd.setCursor(5, 2);
  // print the number of seconds since reset:
  lcd.print(playerScore);  
}

// Function to control the buzzer
void ringBuzzer () {
  digitalWrite(buzzer, HIGH);  // Turn on the buzzer
  delay(40);  // Delay for 0.5 seconds
  digitalWrite(buzzer, LOW);  // Turn off the buzzer
}

// Function to flash the two lights briefly
void flashLights() {
  // digitalWrite(greenLED, HIGH); // Turn on LED on pin 13
  digitalWrite(redLED, HIGH); // Turn on LED on pin 12
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
  digitalWrite(12, LOW);
}