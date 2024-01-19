echo "Installing Backend..."
cd backend
echo "Creating an environment under ./venv folder..."
python -m venv venv || (echo "Unable to create enviroment" && exit 1)
source venv/bin/activate
echo "Installing requirements..."
pip install -r requirements_dev.txt || (echo "Unable to install requirements" && exit 1)
echo "Backend installed"
