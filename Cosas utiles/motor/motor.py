import RPi.GPIO as GPIO
import time

# Definir pines
DIRECCION = 18
PULSO = 17

# Configuración de GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(PULSO, GPIO.OUT)
GPIO.setup(DIRECCION, GPIO.OUT)

# Función para convertir microsegundos a segundos
def microsegundos_a_segundos(microsegundos):
    return microsegundos / 1e6

# Función de control del motor
def control_motor(duracion_pulso_microsegundos, tiempo_entre_pulsos_microsegundos):
    duracion_pulso = microsegundos_a_segundos(duracion_pulso_microsegundos)
    tiempo_entre_pulsos = microsegundos_a_segundos(tiempo_entre_pulsos_microsegundos)

    print("Estableciendo dirección en estado bajo...")
    GPIO.output(DIRECCION, GPIO.LOW)
    time.sleep(0.00001)  # delayMicroseconds(10)

    print("Iniciando bucle de control del motor...")
    while True:
        for j in range(5000):
            print(f"Enviando pulso {j+1} de 5000...")
            GPIO.output(PULSO, GPIO.HIGH)
            time.sleep(duracion_pulso)
            GPIO.output(PULSO, GPIO.LOW)
            time.sleep(tiempo_entre_pulsos)

try:
    # Aquí puedes ajustar los valores según tus necesidades
    DURACION_PULSO_MICROSEGUNDOS = 200
    TIEMPO_ENTRE_PULSOS_MICROSEGUNDOS = 1000

    control_motor(DURACION_PULSO_MICROSEGUNDOS, TIEMPO_ENTRE_PULSOS_MICROSEGUNDOS)
except KeyboardInterrupt:
    print("Programa interrumpido por el usuario.")
    GPIO.cleanup()


#Este arhivo es mas que todo para aprender a controlar el motor paso a paso
# Como se puede ver lo importante esta en poner 200 microsegundos para que el motor reconozca el pulso 
