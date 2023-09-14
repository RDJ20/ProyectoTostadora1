import asyncio
import websockets
import serial
import RPi.GPIO as GPIO
import time

# Función que lee datos desde el puerto serial
def read_from_serial(port, baudrate=9600):
    ser = serial.Serial(port, baudrate)
    while True:
        line = ser.readline().decode('utf-8').strip()
        yield line

# Función que envía datos desde el puerto serial a través del WebSocket
async def send_temperature_data(websocket, path):
    for temperature_data in read_from_serial('/dev/ttyACM0'):
        await websocket.send(temperature_data)
        await asyncio.sleep(1)  # Puedes ajustar este valor si es necesario

# Configuración del servo
SERVO_PIN = 22  # Cambia este número al pin GPIO que estés usando
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)
pwm.start(0)

def set_angle(angle):
    duty = ((angle / 180) * (12.5 - 2.5)) + 2.5
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

# Iniciar ambos servidores WebSocket
temperature_server = websockets.serve(send_temperature_data, "0.0.0.0", 8765)
servo_server = websockets.serve(handle, '0.0.0.0', 5678)

# Ejecutar ambos servidores en el bucle de eventos
loop = asyncio.get_event_loop()
loop.run_until_complete(temperature_server)
loop.run_until_complete(servo_server)
loop.run_forever()
