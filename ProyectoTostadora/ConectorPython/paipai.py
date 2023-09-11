import serial
import requests
import time

port1 = 'COM4'
port2 = 'COM13'
baudrate = 115200
baudrate2 = 9600
ser1 = serial.Serial(port1, baudrate) # Puerto original
time.sleep(5)
ser2 = serial.Serial(port2, baudrate2) # Nuevo puerto
time.sleep(5)

while True:
    try:
        response = requests.get('http://localhost:3000/api/comenzar', timeout=5)
        data = response.json()['data']
        time.sleep(0.1)
        print(data)
        for entry in data:
            print(entry['estado'])
            if entry['estado'] == 1:
                time.sleep(2)
                ser1.write('comenzar\n'.encode())
                for _ in range(1200):
                    response2 = requests.get('http://localhost:3000/api/comenzar', timeout=5)
                    data2 = response2.json()['data']
                    if data2[0]['estado'] == 2:
                        break
                    line = ser1.readline().decode().strip()
                    print(line)
                    response = requests.post('http://localhost:3000/api/datos', json={'temperatura_aire': line, 'temperatura_cafe': line})
                    print(response)
                break
            if entry['estado'] == 2:
                ser1.write('fin\n'.encode())
                print("Final")

        # Nueva lógica para interactuar con ser2 (COM13)
        response = requests.get('http://localhost:3000/api/motor', timeout=5)
        data = response.json()['data'][0] # Obtener el primer elemento de la lista "data"
        print(data)
        time.sleep(0.1)
        
        if data['comenzar'] == 1:
            velocidad = str(data['velocidad'])
            ser2.write(f'comenzar {velocidad}\n'.encode()) # Enviar 'comenzar' con la velocidad para iniciar el motor
            print(f"Comenzando motor con velocidad: {velocidad}")
        else:
            ser2.write('detener\n'.encode()) # Enviar 'detener' para detener el motor
            print("Detener motor")
    
    except requests.exceptions.RequestException as e:
        print('No se pudo conectar, intentando de nuevo...')
        time.sleep(3)