import RPi.GPIO as GPIO
import time
import websockets
import asyncio

# Configuración
SERVO_PIN = 22  # Cambia este número al pin GPIO que estés usando
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)

# Configura el pin para PWM con una frecuencia de 50Hz
pwm = GPIO.PWM(SERVO_PIN, 50)
pwm.start(0)  # Inicia el PWM con un ciclo de trabajo del 0%

def set_angle(angle):
    """
    Establece el ángulo del servomotor.
    """
    # Ajusta el ancho de pulso según las especificaciones del servo FT5330M
    duty = ((angle / 180) * (12.5 - 2.5)) + 2.5
    # Asegurarse de que el ciclo de trabajo esté dentro del rango permitido
    duty = max(2.5, min(12.5, duty))
    print(f"Ciclo de trabajo: {duty}")
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)

async def handle(websocket, path):
    print(f"¡Nuevo cliente conectado desde {websocket.remote_address}!")
    while True:
        data = await websocket.recv()
        if data:
            angle = int(data)
            print(f"Recibido: {angle}")
            set_angle(angle)

start_server = websockets.serve(handle, '0.0.0.0', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()