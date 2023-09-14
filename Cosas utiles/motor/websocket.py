# Este codigo esta hecho para funcionar con los sliders, ya que cuando ingreso 0 se para 
# pero del 1 al 100 se enciende

import asyncio
import websockets
import serial

SERIAL_PORT = "/dev/ttyACM1"
BAUDRATE = 9600
ser = serial.Serial(SERIAL_PORT, BAUDRATE)

def valor_proporcional(x):
    m = 50.505
    b = 949.495
    y = m * x + b
    return y

async def handle(websocket, path):
    while True:
        data = await websocket.recv()
        if data:
            value = int(data)
            if value == 0:
                command = "SPIN,0\n"
            else:
                speed = int(valor_proporcional(value))
                command = f"SPIN,{speed}\n"
            print(f"Enviando comando al Arduino: {command.strip()}")  # Imprimir el comando
            ser.write(command.encode())

start_server = websockets.serve(handle, '0.0.0.0', 5675)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()