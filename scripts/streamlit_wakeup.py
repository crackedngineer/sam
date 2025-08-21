###############################
# Install Locally
# pip install selenium webdriver-manager
###############################

from selenium import webdriver as wb
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as ec
from webdriver_manager.chrome import ChromeDriverManager


import time


def create_browser(arguments: list) -> wb.Chrome:
    """Create a Chrome browser instance."""
    options = wb.chrome.options.Options()
    for arg in arguments:
        options.add_argument(f'--{arg}')
    return wb.Chrome(service=wb.chrome.service.Service(ChromeDriverManager().install()), options = options)

def wakeup_streamlit(url: str, arguments: list, verbose: bool = False) -> None:
    """Wakeup a Streamlit Cloud URL by clicking the wakeup button."""
    if not url.endswith('.streamlit.app/'):
        raise ValueError('URL must be a Streamlit Cloud URL.')
    browser = create_browser(arguments)
    try:
        if verbose:
            print(f'[{time.ctime()}] Waking up Streamlit app at {url}...')
            print(f'Getting {url}...')
        browser.get(url)
        time.sleep(10)
        try:
            button = WebDriverWait(browser, 5).until(
                ec.presence_of_element_located((
                    By.CSS_SELECTOR, '[data-testid="wakeup-button-viewer"]'
                ))
            )
            if verbose:
                print('Found the button!')
            button.click()
        except Exception:
            if verbose:
                print('Could not find the button.')
    except Exception as e:
        if verbose:
            print(f'An error occurred: {e}')
    finally:
        time.sleep(20)
        browser.quit()
        if verbose:
            print('Browser closed.')

if __name__ == "__main__":
    ARGUMENTS = ['headless', 'disable-gpu', 'no-sandbox', 'disable-dev-shm-usage']

    # Add the URLs you want to wake up here. Only Streamlit URLs are supported.
    URLS = [
        'https://ilovemy.streamlit.app/',
    ]

    # Set to True to print the logs
    VERBOSE = True

    if len(URLS) == 0:
        raise ValueError('No URLs provided.')

    for URL in URLS:
        wakeup_streamlit(url=URL, arguments=ARGUMENTS, verbose=VERBOSE)
