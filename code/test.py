import os
from selenium import webdriver
from selenium.webdriver.firefox.options import Options as FirefoxOptions

# Launch a headless Firefox instance:
driverOpts = FirefoxOptions()
driverOpts.add_argument('--headless')
driver = webdriver.Firefox(options=driverOpts)

# Load the web page:
driver.get('file://' + os.getcwd() + '/index.html')

try:
	print('Page title: ' + driver.title)

except:
	print('An error was raised while interacting with the webpage')
	raise

finally:
	# Close the web driver:
	driver.close()

