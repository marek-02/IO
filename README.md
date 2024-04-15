# IO

## About project
Application for preliminary data analysis and visualization.

Project written using Django and React for the Software Engineering (Inżynieria Oprogramowania) course at AGH.


## Configuration
Clone repository 
```console
git clone https://github.com/marek-02/IO
```
Create virtual enviroment (suggested, not necessary) and install backend requirements
```console
python -m venv .venv
.\.venv\Scripts\activate.bat

pip install -r .\requirements.txt
```
Install frontend requirements
```console
cd .\front\
npm install
```
Run server:
```console
cd .\dataAnalyzer\
py manage.py runserver
```
Run frontend:
```console
cd .\front\
npm start
```
