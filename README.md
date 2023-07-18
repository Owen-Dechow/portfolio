# portfolio
A portfolio website made with the Python Django web framework.
[Check it out here!](https://owendechow.pythonanywhere.com/)

## Installation
1. Clone repository
   ```bash
   $ git clone https://github.com/Owen-Dechow/portfolio.git
   $ cd portfolio
   ```
   
1. Create/activate virtual environment
    ```bash
    $ python3 -m venv venv
    $ ./venv/bin/activate
    ```

1. Install dependencies
    ```bash
    $ pip -r install ./requirements.txt
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
   $ python3 manage.py migrate
   ```
1. Create superuser
   ```bash
   $ python3 manage.py createsuperuser
   # Follow the instructions from there.
   ```

1. Load initial color objects
   ```bash
   $ python3 manage.py loaddata colors
   ```

1. Run Tests
   ```bash
   $ python3 manage.py test
   ```

1. **Customize your website!**