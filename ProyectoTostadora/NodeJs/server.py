import asyncio
import websockets
import serial
import RPi.GPIO as GPIO
import time

SERIAL_PORT = "/dev/ttyACM1"
BAUDRATE = 9600
ser = serial.Serial(SERIAL_PORT, BAUDRATE)

def valor_proporcional(x):
    m = 50.505
    b = 949.495
    y = m * x + b
    return y

async def arduino_handle(websocket, path):
    while True:
        data = await websocket.recv()
        if data:
            value = int(data)
            if value == 0:
                command = "SPIN,0\n"
            else:
                speed = int(valor_proporcional(value))
                command = f"SPIN,{speed}\n"
            print(f"Enviando comando al Arduino: {command.strip()}")
            ser.write(command.encode())

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
        await asyncio.sleep(1)

# Configuración del servo
SERVO_PIN = 22
GPIO.setmode(GPIO.BCM)
GPIO.setup(SERVO_PIN, GPIO.OUT)
pwm = GPIO.PWM(SERVO_PIN, 50)
pwm.start(0)

def set_angle(angle):
    duty = ((angle / 180) * (12.5 - 2.5)) + 2.5
    duty = max(2.5, min(12.5, duty))
    print(f"Ángulo solicitado: {angle}°")
    print(f"Ciclo de trabajo: {duty:.2f}%")
    pwm.ChangeDutyCycle(duty)
    time.sleep(0.5)

async def servo_handle(websocket, path):
    print(f"¡Nuevo cliente conectado desde {websocket.remote_address}!")
    while True:
        data = await websocket.recv()
        if data:
            angle = int(data)
            set_angle(angle)

# Iniciar los tres servidores WebSocket
temperature_server = websockets.serve(send_temperature_data, "0.0.0.0", 8765)
servo_server = websockets.serve(servo_handle, '0.0.0.0', 5678)
arduino_server = websockets.serve(arduino_handle, '0.0.0.0', 5675)

# Ejecutar los tres servidores en el bucle de eventos
loop = asyncio.get_event_loop()
loop.run_until_complete(temperature_server)
loop.run_until_complete(servo_server)
loop.run_until_complete(arduino_server)
loop.run_forever()
