#!/usr/bin/env python3

from hashlib import sha256
from random import randint

for name in [b'Buckley', b'Daria', b'Hank', b'Sam', b'Yiqun']:
	addr = sha256(name).hexdigest()
	balance = str(randint(0, pow(2, 32)))
	print(addr + ' ' + balance)

