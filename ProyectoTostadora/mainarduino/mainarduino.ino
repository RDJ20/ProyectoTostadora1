#include <Adafruit_MAX31856.h>

const int pinDIR = 8;
const int pinPUL = 9;

int direccion = HIGH; 
const int velocidad = 70; 

Adafruit_MAX31856 maxthermo = Adafruit_MAX31856(10, 11, 12, 13);


bool isRunning = false;


int count = 0;

void setup() {
  Serial.begin(115200);
  maxthermo.begin();
  maxthermo.setThermocoupleType(MAX31856_TCTYPE_K);
  pinMode(pinDIR, OUTPUT);
  pinMode(pinPUL, OUTPUT);
}

void loop() {
  while (Serial.available() > 0) {
    // Leer el comando
    String command = Serial.readString();
    command.trim();

 
    if (command == "comenzar") {
      isRunning = true;
      count = 0;
    }
  }


  if (isRunning) {
    Serial.println(maxthermo.readThermocoupleTemperature());
    delay(1000);
    count++;
    

  }

  
  if (count >= 30) {
    isRunning = false;
    count = 0;
  }
}