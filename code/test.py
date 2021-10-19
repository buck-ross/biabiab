import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

# Prompt for all necessary user input:
while True:
	action = input('Enter the action to be preformed [validate, balance, membership]: ')
	if action in [ 'validate', 'balance', 'membership' ]:
		break
	print('Invalid input. Try again.')

if action in [ 'balance', 'membership' ]:
	param = input('Please provide the address to query: ')
else:
	param = 'a'

os.chdir('..')
fname = os.path.realpath(input('Please provide the path to the file containing the blockchain: '))
os.chdir('code')

# Launch a headless Firefox instance:
driverOpts = FirefoxOptions()
driverOpts.add_argument('--headless')
driver = webdriver.Firefox(options=driverOpts)

# Load the web page:
driver.get('file://' + os.getcwd() + '/index.html')

try:
	# Wait for the input div to be displayed:
	WebDriverWait(driver, 30).until(
		expected_conditions.presence_of_element_located((By.ID, 'input'))
	)

	# Upload all necessary files:
	for option in driver.find_elements(By.TAG_NAME, 'option'):
		if option.text == action:
			option.click()

	driver.find_element(By.ID, 'param').send_keys(param)
	driver.find_element(By.ID, 'blockchain').send_keys(fname)

	# Wait for the output to be produced:
	result = WebDriverWait(driver, 30).until(
		expected_conditions.presence_of_element_located((By.ID, 'result'))
	)
	print(result.text)

except:
	print('An error was raised while interacting with the webpage')
	raise

finally:
	# Close the web driver:
	driver.close()

