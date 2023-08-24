#!/usr/bin/env python
import sys
import time
from SX127x.LoRa import *
from SX127x.LoRaArgumentParser import LoRaArgumentParser
from SX127x.board_config import BOARD
import RPi.GPIO as GPIO
GPIO.setwarnings(False)
BOARD.setup()

parser = LoRaArgumentParser("A simple LoRa beacon")
parser.add_argument("--put", "-P", dest="put", type=int, help="Choose an ID")


class LoRaBeacon(LoRa):

    def __init__(self, verbose=False):
        super(LoRaBeacon, self).__init__(verbose)
        self.set_mode(MODE.SLEEP)
        self.set_dio_mapping([1,0,0,0,0,0])

    def on_tx_done(self):
        global args
        self.clear_irq_flags(RxDone=1)
        payload = self.read_payload(nocheck=True)
        start_time = time.time()
        while (payload==[]):
             self.clear_irq_flags(RxDone=1)
             payload = self.read_payload(nocheck=True)
             if (time.time() - start_time > 10): # wait until receive data or 10s
                    payload=("f("+str(args.put)+") fail").encode("utf-8")
                    break
        print(bytes(payload).decode("utf-8",'ignore')) # Receive DATA
        sys.exit(0)
    def start(self):
        global args
        self.write_payload([48+args.put]) # Send INF
        self.set_mode(MODE.TX)
        time.sleep(3) # there must be a better solution but sleep() works
        self.reset_ptr_rx()
        self.set_mode(MODE.RXCONT) # Receiver mode
        start_time = time.time()
        while (time.time() - start_time < 10): # wait until receive data or 10s
            pass;
        #self.reset_ptr_rx()
        #self.set_mode(MODE.RXCONT) # Receiver mode

lora = LoRaBeacon(verbose=False)
args = parser.parse_args(lora)

lora.set_pa_config(pa_select=1)
#lora.set_rx_crc(True)
#lora.set_agc_auto_on(True)
#lora.set_lna_gain(GAIN.NOT_USED)
#lora.set_coding_rate(CODING_RATE.CR4_6)
#lora.set_implicit_header_mode(False)
#lora.set_pa_config(max_power=0x04, output_power=0x0F)
#lora.set_pa_config(max_power=0x04, output_power=0b01000000)
#lora.set_low_data_rate_optim(True)
#lora.set_pa_ramp(PA_RAMP.RAMP_50_us)
lora.set_freq(433.0)

#print(lora)
#assert(lora.get_lna()['lna_gain'] == GAIN.NOT_USED)
assert(lora.get_agc_auto_on() == 1)

try:
    lora.start()
except KeyboardInterrupt:
    sys.stdout.flush()
    sys.stderr.write("KeyboardInterrupt\n")
finally:
    sys.stdout.flush()
    GPIO.cleanup()
    lora.set_mode(MODE.SLEEP)
    BOARD.teardown()
