import urllib.request
import json
import base64

def compile_code(code):
    url = "https://hexi.wokwi.com/build"
    data = {
         "format": "hex",
         "sketch": code
    }
    req = urllib.request.Request(url, data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read())
        print("Success!", result.keys())
    except Exception as e:
        print("Error:", e)

compile_code("void setup() {} void loop() {}")
