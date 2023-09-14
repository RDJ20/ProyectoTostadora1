#include <ContinuousStepper.h>
//Este es el codigo que al final si me funciono, ninguno de los motore.py me funciono como este

ContinuousStepper<StepperDriver> stepper;

String inputString = "";  
bool stringComplete = false;  

void setup() {

  Serial.begin(9600);

  
  stepper.begin(2, 3);

  stepper.spin(200);
}

void loop() {
  stepper.loop();

  if (stringComplete) {
    processCommand(inputString);
    inputString = "";
    stringComplete = false;
  }
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    if (inChar == '\n') {
      stringComplete = true;
    }
  }
}

void processCommand(String command) {
  int commaIndex = command.indexOf(',');
  String cmd = command.substring(0, commaIndex);
  int speed = command.substring(commaIndex + 1).toInt();

  if (cmd == "SPIN") {
    stepper.spin(speed);
  } else if (cmd == "STOP") {
    stepper.stop();
  }
  
}
