import asyncio
import websockets
import serial

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

# Iniciar el servidor WebSocket
start_server = websockets.serve(send_temperature_data, "0.0.0.0", 8765)

# Ejecutar el servidor WebSocket
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()