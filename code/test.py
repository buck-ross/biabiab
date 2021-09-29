import os
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

# Prompt for all necessary user input:
os.chdir('..')
fname1 = os.path.realpath(input('Please provide the path to the first input file: '))
fname2 = os.path.realpath(input('Please provide the path to the second input file: '))
fname3 = os.path.realpath(input('Please provide the path to the third input file: '))
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
	driver.find_element(By.ID, 'accounts1').send_keys(fname1)
	driver.find_element(By.ID, 'accounts2').send_keys(fname2)
	driver.find_element(By.ID, 'accounts3').send_keys(fname3)

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

