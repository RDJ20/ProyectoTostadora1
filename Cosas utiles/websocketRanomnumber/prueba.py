# server.py
import asyncio
import websockets
from random import randint

async def send_random_number(websocket, path):
    while True:
        number = randint(1, 100)
        await websocket.send(str(number))
        await asyncio.sleep(1)  # Espera 1 segundo antes de enviar otro número

start_server = websockets.serve(send_random_number, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()