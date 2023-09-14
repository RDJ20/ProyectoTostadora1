import RPi.GPIO as GPIO
import time

# Definir pines
DIRECCION = 18
PULSO = 17

# Configuración de GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(PULSO, GPIO.OUT)
GPIO.setup(DIRECCION, GPIO.OUT)

def girar_una_vuelta():
    # Establecer dirección (puedes cambiar esto según la dirección que desees)
    GPIO.output(DIRECCION, GPIO.LOW)

    # Enviar 200 pulsos para una vuelta completa
    for _ in range(200):
        GPIO.output(PULSO, GPIO.HIGH)
        time.sleep(0.00001)  # Duración del pulso
        GPIO.output(PULSO, GPIO.LOW)
        time.sleep(0.00001)  # Tiempo entre pulsos

try:
    while True:  # Bucle infinito
        girar_una_vuelta()
except KeyboardInterrupt:
    print("Programa interrumpido por el usuario.")
    GPIO.cleanup()

    #Nota importante, el primer archivo de motor quiza de fallas, es mejor usar este con la configuracion de la foto en el driver