# portfolio
A portfolio website made with the Python Django web framework.
[Check it out here!](https://owendechow.pythonanywhere.com/)

## Installation
1. Clone repository
   ```bash
   git clone https://github.com/Owen-Dechow/portfolio.git
   cd portfolio
   ```
1. Create virtual environment
    ```bash
    python3 -m venv venv
    ```
1. Install dependencies
    ```bash
    pip -r install ./requirements.txt
    ```
1. Create .env file in the portfolio directory
   ```bash
   .
   ├── base/
   ├── media/
   ├── portfolio/
   ├── ├── .env.example    # copy this file into new .env file
   ├── └── .env            # new file
   └── .gitignore
   ```
1. Apply migrations
   ```bash
   python3 ./manage.py migrate
   ```
1. Create color object
   ```bash
   python3 ./manage.py shell
   ```
   ```python
   from base import models
   color = models.Base_ColorPalette()
   color.name = "Default"
   color.save()
   exit()
   ```
1. You're all ready to go!
