#include <SPI.h>
#include <LoRa.h>
#include "DHT.h"
char current='2';
#define DHTPIN 8
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
void setup() {
  Serial.begin(9600);
  while (!Serial);
  digitalWrite(4, HIGH);
  delay(200);
  pinMode(4, OUTPUT); 
  Serial.println("LoRa Receiver");

  if (!LoRa.begin(433E6)) {//E6
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  dht.begin();
}

void loop() {
  // try to parse packet
  int packetSize = LoRa.parsePacket();
  if (packetSize) {
    // received a packet
    Serial.print("Received packet: ");

    // read packet
    char a[50];
    int i=0;
    while (LoRa.available()) {
      a[i]=(char)LoRa.read();
      i++;
    }
    delay(3000);
    Serial.println(a);
    if(a[0]==current){
      double r = dht.readHumidity();
      double s = dht.readTemperature();
      String result="r("+String(current)+"): "+String(r)+" "+String(s);
      Serial.print("send packet '");
      Serial.println(result);
      LoRa.beginPacket();
      LoRa.print(result);
      LoRa.endPacket();
      digitalWrite(4, LOW);
    }
  }
}
