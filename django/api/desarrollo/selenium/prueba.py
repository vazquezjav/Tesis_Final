from selenium import webdriver 
from selenium.webdriver.firefox.options import Options

firefoxOptions = Options()
firefoxOptions.add_argument("-headless")

browser = webdriver.Firefox(executable_path="./geckodriver", options=firefoxOptions)
browser.get('https://www.linuxhint.com')
print('Title: %s' % browser.title)
browser.quit()
